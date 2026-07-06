import { perenualHttp } from '@/shared/lib/http'
import { toTitleCase, flattenText } from '@/shared/lib/format'
import type {
  CatalogFilters,
  CatalogPage,
  PlantDetailResult,
  PlantRepository,
} from '../domain/plant.repository'
import type { PlantAnatomyPart, PlantDetail, PlantSummary } from '../domain/plant.entity'
import type { PerenualSpeciesRaw } from './perenual-species.types'
import { CURATED_PLANTS } from './curated-plants.data'

function imageOf(raw: PerenualSpeciesRaw): string | null {
  const image = raw.default_image
  if (!image) return null
  return image.regular_url || image.medium_url || image.original_url || image.small_url || image.thumbnail || null
}

function wateringBenchmarkOf(raw: PerenualSpeciesRaw): string | null {
  if (raw.watering_benchmark) return raw.watering_benchmark
  const bench = raw.watering_general_benchmark
  // Perenual sometimes wraps this value in literal quote characters, e.g. `"7-10"`.
  if (bench?.value) return `${bench.value.replace(/^"|"$/g, '')} ${bench.unit || 'days'}`.trim()
  return null
}

function toSummary(raw: PerenualSpeciesRaw): PlantSummary {
  return {
    id: raw.id,
    commonName: toTitleCase(raw.common_name) || 'Unknown',
    scientificNames: raw.scientific_name || [],
    hue: raw.hue ?? 130,
    image: imageOf(raw),
    watering: raw.watering ?? null,
    sunlight: raw.sunlight || [],
    indoor: !!raw.indoor,
    poisonous: !!(raw.poisonous_to_humans || raw.poisonous_to_pets),
  }
}

function dimensionsTextOf(raw: PerenualSpeciesRaw): string {
  if (typeof raw.dimensions === 'string') return raw.dimensions
  if (raw.dimensions && raw.dimensions.max_value != null) {
    const min = raw.dimensions.min_value != null ? `${raw.dimensions.min_value}–` : ''
    return `${min}${raw.dimensions.max_value} ${raw.dimensions.unit || ''}`.trim()
  }
  return ''
}

function anatomyOf(raw: PerenualSpeciesRaw): PlantAnatomyPart[] {
  return (raw.plant_anatomy || []).map((entry) => ({
    part: entry.part,
    colors: entry.color || [],
  }))
}

function toDetail(raw: PerenualSpeciesRaw): PlantDetail {
  const hMin = raw.hardiness?.min != null ? parseInt(String(raw.hardiness.min), 10) : null
  const hMax = raw.hardiness?.max != null ? parseInt(String(raw.hardiness.max), 10) : null
  return {
    ...toSummary(raw),
    commonName: toTitleCase(raw.common_name),
    family: raw.family || 'Plantae',
    type: raw.type || 'plant',
    origin: raw.origin || [],
    description: flattenText(raw.description),
    cycle: raw.cycle || '',
    wateringBenchmark: wateringBenchmarkOf(raw),
    maintenance: raw.maintenance ?? null,
    careLevel: raw.care_level ?? null,
    growthRate: raw.growth_rate ?? null,
    droughtTolerant: !!raw.drought_tolerant,
    flowers: !!raw.flowers,
    edibleFruit: !!raw.edible_fruit,
    edibleLeaf: !!raw.edible_leaf,
    medicinal: !!raw.medicinal,
    poisonousToHumans: !!raw.poisonous_to_humans,
    poisonousToPets: !!raw.poisonous_to_pets,
    dimensionsText: dimensionsTextOf(raw),
    pruningMonths: raw.pruning_month || [],
    propagation: raw.propagation || [],
    soil: raw.soil || [],
    attracts: raw.attracts || [],
    pestSusceptibility: raw.pest_susceptibility || [],
    anatomy: anatomyOf(raw),
    hardiness: hMin != null && hMax != null ? { min: hMin, max: hMax } : null,
  }
}

function matchesFilters(raw: PerenualSpeciesRaw, filters: CatalogFilters): boolean {
  if (filters.q) {
    const haystack = [raw.common_name, ...(raw.scientific_name || [])].join(' ').toLowerCase()
    if (!haystack.includes(filters.q.toLowerCase())) return false
  }
  if (filters.indoor && !raw.indoor) return false
  if (filters.edible && !(raw.edible_fruit || raw.edible_leaf || raw.cuisine)) return false
  if (filters.poisonous && !(raw.poisonous_to_humans || raw.poisonous_to_pets)) return false
  if (filters.cycle && (raw.cycle || '').toLowerCase() !== filters.cycle.toLowerCase()) return false
  if (filters.watering && (raw.watering || '').toLowerCase() !== filters.watering.toLowerCase()) return false
  if (filters.sunlight) {
    const normalized = (raw.sunlight || []).map((s) => s.toLowerCase().replace(/[\s-]/g, '_'))
    const wanted = filters.sunlight.replace(/[\s-]/g, '_')
    if (!normalized.some((s) => s.includes(wanted) || wanted.includes(s))) return false
  }
  if (filters.hardiness) {
    const zone = Number(filters.hardiness)
    const min = Number(raw.hardiness?.min ?? 0)
    const max = Number(raw.hardiness?.max ?? 13)
    if (zone < min || zone > max) return false
  }
  return true
}

function buildSearchParams(filters: CatalogFilters, page: number) {
  const params: Record<string, string | number> = { page }
  if (filters.q) params.q = filters.q
  if (filters.indoor) params.indoor = 1
  if (filters.edible) params.edible = 1
  if (filters.poisonous) params.poisonous = 1
  if (filters.cycle) params.cycle = filters.cycle
  if (filters.watering) params.watering = filters.watering
  if (filters.sunlight) params.sunlight = filters.sunlight
  if (filters.hardiness) params.hardiness = filters.hardiness
  return params
}

export class PerenualPlantRepository implements PlantRepository {
  async search(filters: CatalogFilters, page: number): Promise<CatalogPage> {
    try {
      const { data } = await perenualHttp.get<{ data: PerenualSpeciesRaw[]; total?: number }>(
        '/v2/species-list',
        { params: buildSearchParams(filters, page) },
      )
      if (data?.data?.length) {
        return { items: data.data.map(toSummary), total: data.total ?? data.data.length, source: 'live' }
      }
      throw new Error('empty')
    } catch {
      const matched = CURATED_PLANTS.filter((raw) => matchesFilters(raw, filters))
      return { items: matched.map(toSummary), total: matched.length, source: 'sample' }
    }
  }

  async getDetail(id: number): Promise<PlantDetailResult> {
    try {
      const { data } = await perenualHttp.get<PerenualSpeciesRaw>(`/v2/species/details/${id}`)
      if (data?.id) return { detail: toDetail(data), source: 'live' }
      throw new Error('empty')
    } catch {
      const raw = CURATED_PLANTS.find((p) => String(p.id) === String(id))
      return { detail: raw ? toDetail(raw) : null, source: 'sample' }
    }
  }
}

export { toSummary, toDetail }
