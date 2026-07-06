import { perenualHttp } from '@/shared/lib/http'
import { toTitleCase, flattenText } from '@/shared/lib/format'
import type { Pest } from '../domain/pest.entity'
import type { PestSearchResult, PestsRepository } from '../domain/pests.repository'
import { CURATED_DISEASES } from './curated-diseases.data'

interface PerenualHostRaw {
  common_name?: string
}

interface PerenualPestRaw {
  id: number
  common_name?: string | null
  scientific_name?: string | string[] | null
  host?: (string | PerenualHostRaw)[] | null
  description?: unknown
  solution?: unknown
  hue?: number | null
}

function toPest(raw: PerenualPestRaw): Pest {
  const scientific = Array.isArray(raw.scientific_name)
    ? raw.scientific_name.join(', ')
    : raw.scientific_name || ''
  const hosts = (raw.host || [])
    .map((h) => (typeof h === 'string' ? h : h?.common_name || ''))
    .filter(Boolean)
  return {
    id: raw.id,
    commonName: toTitleCase(raw.common_name) || '—',
    scientificName: String(scientific).trim(),
    hue: raw.hue ?? 40,
    hosts: hosts.slice(0, 4),
    description: flattenText(raw.description, 260),
    solution: flattenText(raw.solution, 220),
  }
}

function curatedToPest(raw: (typeof CURATED_DISEASES)[number]): Pest {
  return {
    id: raw.id,
    commonName: raw.common_name,
    scientificName: raw.scientific_name,
    hue: raw.hue,
    hosts: raw.host,
    description: raw.description,
    solution: raw.solution,
  }
}

export class PerenualPestRepository implements PestsRepository {
  async search(query: string): Promise<PestSearchResult> {
    try {
      const params: Record<string, string> = {}
      if (query) params.q = query
      const { data } = await perenualHttp.get<{ data: PerenualPestRaw[] }>('/pest-disease-list', {
        params,
      })
      if (data?.data?.length) {
        return { items: data.data.map(toPest), source: 'live' }
      }
      throw new Error('empty')
    } catch {
      const matched = query
        ? CURATED_DISEASES.filter((d) => d.common_name.toLowerCase().includes(query.toLowerCase()))
        : CURATED_DISEASES
      return { items: matched.map(curatedToPest), source: 'sample' }
    }
  }
}
