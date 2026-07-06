import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CareGuideSection } from '@/features/plants/domain/care-guide'
import { composeCareGuide } from '@/features/plants/domain/care-guide'
import type { PlantDetail } from '@/features/plants/domain/plant.entity'
import { PerenualPlantRepository } from '@/features/plants/infrastructure/perenual-plant.repository'
import { PerenualCareGuidesRepository } from '../infrastructure/perenual-care-guides.repository'
import { CURATED_PLANTS } from '@/features/plants/infrastructure/curated-plants.data'
import { toSummary } from '@/features/plants/infrastructure/perenual-plant.repository'
import type { Lang } from '@/shared/i18n/translations'

type Status = 'idle' | 'loading' | 'success' | 'error'

const plantRepository = new PerenualPlantRepository()
const careGuidesRepository = new PerenualCareGuidesRepository()

export const useGuidesStore = defineStore('guides', () => {
  const status = ref<Status>('idle')
  const query = ref('')
  const selectedId = ref<number | null>(CURATED_PLANTS[0]?.id ?? null)
  const selectedDetail = ref<PlantDetail | null>(null)
  const sections = ref<CareGuideSection[]>([])

  const directory = computed(() => CURATED_PLANTS.map(toSummary))

  const filteredDirectory = computed(() => {
    const q = query.value.toLowerCase()
    if (!q) return directory.value
    return directory.value.filter((plant) =>
      (plant.commonName + ' ' + plant.scientificNames.join(' ')).toLowerCase().includes(q),
    )
  })

  let loadToken = 0

  async function select(id: number, lang: Lang, titles: Record<CareGuideSection['type'], string>) {
    selectedId.value = id
    status.value = 'loading'
    const token = ++loadToken
    try {
      const [detailResult, liveSections] = await Promise.all([
        plantRepository.getDetail(id),
        careGuidesRepository.getForSpecies(id),
      ])
      if (token !== loadToken) return
      selectedDetail.value = detailResult.detail
      sections.value = liveSections.length
        ? liveSections
        : detailResult.detail
          ? composeCareGuide(detailResult.detail, lang, titles)
          : []
      status.value = 'success'
    } catch {
      if (token === loadToken) status.value = 'error'
    }
  }

  return { status, query, selectedId, selectedDetail, sections, filteredDirectory, select }
})
