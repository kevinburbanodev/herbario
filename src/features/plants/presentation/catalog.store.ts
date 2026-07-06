import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { PlantSummary } from '../domain/plant.entity'
import type { CatalogFilters, DataSource } from '../domain/plant.repository'
import { emptyFilters } from '../domain/plant.repository'
import { PerenualPlantRepository } from '../infrastructure/perenual-plant.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repository = new PerenualPlantRepository()

export const useCatalogStore = defineStore('catalog', () => {
  const status = ref<Status>('idle')
  const filters = ref<CatalogFilters>({ ...emptyFilters })
  const qInput = ref('')
  const results = ref<PlantSummary[]>([])
  const total = ref(0)
  const source = ref<DataSource>('sample')

  const hasFilters = computed(
    () =>
      !!(
        filters.value.q ||
        filters.value.sunlight ||
        filters.value.watering ||
        filters.value.cycle ||
        filters.value.hardiness ||
        filters.value.indoor ||
        filters.value.edible ||
        filters.value.poisonous
      ),
  )

  async function runSearch() {
    status.value = 'loading'
    try {
      const page = await repository.search(filters.value, 1)
      results.value = page.items.slice(0, 30)
      total.value = page.total
      source.value = page.source
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  function setFilter<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    filters.value = { ...filters.value, [key]: value }
    void runSearch()
  }

  function doSearch() {
    filters.value = { ...filters.value, q: qInput.value }
    void runSearch()
  }

  function clearFilters() {
    filters.value = { ...emptyFilters }
    qInput.value = ''
    void runSearch()
  }

  return {
    status,
    filters,
    qInput,
    results,
    total,
    source,
    hasFilters,
    runSearch,
    setFilter,
    doSearch,
    clearFilters,
  }
})
