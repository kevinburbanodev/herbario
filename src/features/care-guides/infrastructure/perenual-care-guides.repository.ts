import { perenualHttp } from '@/shared/lib/http'
import { toTitleCase } from '@/shared/lib/format'
import type { CareGuideSection } from '@/features/plants/domain/care-guide'
import type { CareGuidesRepository } from '../domain/care-guides.repository'

interface PerenualGuideSectionRaw {
  type?: string
  description?: string
}

interface PerenualCareGuideRaw {
  species_id: number
  section?: PerenualGuideSectionRaw[]
}

const KNOWN_TYPES: Record<string, CareGuideSection['type']> = {
  watering: 'watering',
  sunlight: 'sunlight',
  soil: 'soil',
  pruning: 'pruning',
}

export class PerenualCareGuidesRepository implements CareGuidesRepository {
  async getForSpecies(id: number): Promise<CareGuideSection[]> {
    try {
      const { data } = await perenualHttp.get<{ data: PerenualCareGuideRaw[] }>(
        '/species-care-guide-list',
        { params: { species_id: id } },
      )
      const entry = data?.data?.[0]
      const sections = entry?.section || []
      return sections
        .filter((section) => section.description)
        .map((section) => ({
          type: KNOWN_TYPES[section.type || ''] ?? 'pruning',
          title: toTitleCase(section.type) || 'Care',
          text: section.description || '',
        }))
    } catch {
      return []
    }
  }
}
