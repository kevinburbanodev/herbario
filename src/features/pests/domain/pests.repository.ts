import type { Pest } from './pest.entity'
import type { DataSource } from '@/shared/lib/data-source'

export interface PestSearchResult {
  items: Pest[]
  source: DataSource
}

export interface PestsRepository {
  search(query: string): Promise<PestSearchResult>
}
