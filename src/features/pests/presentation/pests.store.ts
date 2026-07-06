import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Pest } from '../domain/pest.entity'
import type { DataSource } from '@/shared/lib/data-source'
import { PerenualPestRepository } from '../infrastructure/perenual-pest.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repository = new PerenualPestRepository()

export const usePestsStore = defineStore('pests', () => {
  const status = ref<Status>('idle')
  const query = ref('')
  const pests = ref<Pest[]>([])
  const source = ref<DataSource>('sample')
  const initialized = ref(false)

  async function search(q: string) {
    query.value = q
    status.value = 'loading'
    initialized.value = true
    try {
      const result = await repository.search(q)
      pests.value = result.items
      source.value = result.source
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  function ensureLoaded() {
    if (!initialized.value) void search('')
  }

  return { status, query, pests, source, initialized, search, ensureLoaded }
})
