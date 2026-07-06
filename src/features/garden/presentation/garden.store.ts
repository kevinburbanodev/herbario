import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { GardenEntry } from '../domain/garden-entry.entity'
import { LocalStorageGardenRepository } from '../infrastructure/local-storage-garden.repository'
import type { PlantDetail } from '@/features/plants/domain/plant.entity'
import { wateringIntervalDays } from '@/features/plants/domain/plant-metrics'

const repository = new LocalStorageGardenRepository()

export const useGardenStore = defineStore('garden', () => {
  const entries = ref<GardenEntry[]>(repository.load())
  const justWateredId = ref<number | null>(null)

  const count = computed(() => entries.value.length)

  function isSaved(id: number): boolean {
    return entries.value.some((entry) => entry.id === id)
  }

  function persist() {
    repository.save(entries.value)
  }

  function toggle(plant: PlantDetail) {
    const index = entries.value.findIndex((entry) => entry.id === plant.id)
    if (index >= 0) {
      entries.value = entries.value.filter((entry) => entry.id !== plant.id)
    } else {
      const entry: GardenEntry = {
        id: plant.id,
        name: plant.commonName,
        latin: plant.scientificNames[0] || '',
        hue: plant.hue,
        everyDays: wateringIntervalDays(plant.watering, plant.wateringBenchmark),
        lastWatered: new Date().toISOString().slice(0, 10),
      }
      entries.value = [...entries.value, entry]
    }
    persist()
  }

  function water(id: number) {
    entries.value = entries.value.map((entry) =>
      entry.id === id ? { ...entry, lastWatered: new Date().toISOString().slice(0, 10) } : entry,
    )
    persist()
    justWateredId.value = id
    setTimeout(() => {
      if (justWateredId.value === id) justWateredId.value = null
    }, 900)
  }

  function remove(id: number) {
    entries.value = entries.value.filter((entry) => entry.id !== id)
    persist()
  }

  return { entries, count, isSaved, toggle, water, remove, justWateredId }
})
