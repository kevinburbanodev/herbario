import type { PlantDetail, PlantSummary } from './plant.entity'
import type { DataSource } from '@/shared/lib/data-source'

export interface CatalogFilters {
  q: string
  sunlight: string
  watering: string
  cycle: string
  hardiness: string
  indoor: boolean
  edible: boolean
  poisonous: boolean
}

export type { DataSource }

export interface CatalogPage {
  items: PlantSummary[]
  total: number
  source: DataSource
}

export interface PlantDetailResult {
  detail: PlantDetail | null
  source: DataSource
}

export interface PlantRepository {
  search(filters: CatalogFilters, page: number): Promise<CatalogPage>
  getDetail(id: number): Promise<PlantDetailResult>
}

export const emptyFilters: CatalogFilters = {
  q: '',
  sunlight: '',
  watering: '',
  cycle: '',
  hardiness: '',
  indoor: false,
  edible: false,
  poisonous: false,
}
