import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PlantDetail } from '../domain/plant.entity'
import type { DataSource } from '../domain/plant.repository'
import { PerenualPlantRepository } from '../infrastructure/perenual-plant.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repository = new PerenualPlantRepository()

export const useDetailStore = defineStore('plantDetail', () => {
  const status = ref<Status>('idle')
  const currentId = ref<number | null>(null)
  const detail = ref<PlantDetail | null>(null)
  const source = ref<DataSource>('sample')
  const cache = new Map<number, { detail: PlantDetail | null; source: DataSource }>()

  let loadToken = 0

  async function loadDetail(id: number) {
    currentId.value = id
    const cached = cache.get(id)
    if (cached) {
      detail.value = cached.detail
      source.value = cached.source
      status.value = 'success'
      return
    }
    status.value = 'loading'
    detail.value = null
    const token = ++loadToken
    try {
      const result = await repository.getDetail(id)
      if (token !== loadToken) return
      cache.set(id, result)
      detail.value = result.detail
      source.value = result.source
      status.value = 'success'
    } catch {
      if (token === loadToken) status.value = 'error'
    }
  }

  function updateCached(id: number, next: PlantDetail) {
    const cached = cache.get(id)
    cache.set(id, { detail: next, source: cached?.source ?? 'sample' })
    if (currentId.value === id) detail.value = next
  }

  return { status, currentId, detail, source, loadDetail, updateCached }
})
