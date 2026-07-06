import type { CareGuideSection } from '@/features/plants/domain/care-guide'

export interface CareGuidesRepository {
  /** Returns an empty array (not an error) when Perenual has no care-guide
   * entry for this species — most of the catalog doesn't have one. */
  getForSpecies(id: number): Promise<CareGuideSection[]>
}
