import type { GardenRepository } from '../domain/garden.repository'
import type { GardenEntry } from '../domain/garden-entry.entity'

const STORAGE_KEY = 'herbario_garden_v1'

export class LocalStorageGardenRepository implements GardenRepository {
  load(): GardenEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  save(entries: GardenEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      // storage unavailable (private mode / quota) — silently no-op
    }
  }
}
