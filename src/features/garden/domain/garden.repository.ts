import type { GardenEntry } from './garden-entry.entity'

export interface GardenRepository {
  load(): GardenEntry[]
  save(entries: GardenEntry[]): void
}
