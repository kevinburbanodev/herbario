<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLanguage } from '@/shared/i18n/language'
import { useCatalogStore } from '../catalog.store'
import PlantCard from '../components/PlantCard.vue'
import LoadingSkeleton from '@/shared/ui/LoadingSkeleton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import SourceBadge from '@/shared/ui/SourceBadge.vue'

const { t } = useLanguage()
const catalog = useCatalogStore()

const resultLabel = computed(
  () => `${catalog.results.length} ${catalog.results.length === 1 ? t.value.res_one : t.value.res_many}`,
)

const sunlightOptions = computed(() => [
  { value: '', label: `${t.value.f_sun}: ${t.value.f_any}` },
  { value: 'full_sun', label: t.value.sun_full },
  { value: 'part_shade', label: t.value.sun_part },
  { value: 'full_shade', label: t.value.sun_shade },
])
const wateringOptions = computed(() => [
  { value: '', label: `${t.value.f_water}: ${t.value.f_any}` },
  { value: 'frequent', label: t.value.w_freq },
  { value: 'average', label: t.value.w_avg },
  { value: 'minimum', label: t.value.w_min },
])
const cycleOptions = computed(() => [
  { value: '', label: `${t.value.f_cycle}: ${t.value.f_any}` },
  { value: 'perennial', label: t.value.c_per },
  { value: 'annual', label: t.value.c_ann },
  { value: 'biennial', label: t.value.c_bi },
])
const hardinessOptions = computed(() => [
  { value: '', label: `${t.value.f_zone}: ${t.value.f_any}` },
  ...[3, 5, 7, 9, 10, 11, 12].map((zone) => ({ value: String(zone), label: `${t.value.f_zone} ${zone}` })),
])

function onSelect(key: 'sunlight' | 'watering' | 'cycle' | 'hardiness', event: Event) {
  catalog.setFilter(key, (event.target as HTMLSelectElement).value)
}

onMounted(() => {
  if (catalog.status === 'idle') void catalog.runSearch()
})
</script>

<template>
  <section class="mx-auto max-w-[1300px] px-5 pt-30 pb-22.5 sm:px-16">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div class="font-mono text-xs tracking-[0.4em] text-moss uppercase">{{ t.cat_kicker }}</div>
        <h1 class="mt-2.5 font-display text-[clamp(40px,7vw,84px)] leading-[0.95] text-forest">
          {{ t.cat_title }}
        </h1>
      </div>
      <div class="flex items-center gap-3">
        <span class="font-mono text-[11px] tracking-wide text-sage uppercase">{{ resultLabel }}</span>
        <SourceBadge :source="catalog.source" />
      </div>
    </div>

    <div class="mt-8.5 border-t border-b border-line py-5.5">
      <div
        class="flex max-w-160 items-center gap-3.5 rounded-full border-[1.5px] border-forest bg-card py-1.5 pr-2 pl-6"
      >
        <span class="font-mono text-[15px] text-sage">⌕</span>
        <input
          v-model="catalog.qInput"
          :placeholder="t.cat_search"
          class="flex-1 border-none bg-none py-2 font-serif text-lg text-ink outline-none"
          @keydown.enter="catalog.doSearch"
        />
        <button
          type="button"
          class="cursor-pointer rounded-full border-none bg-forest px-6 py-2.75 font-serif text-base text-paper hover:bg-moss"
          @click="catalog.doSearch"
        >
          {{ t.cat_go }}
        </button>
      </div>
      <div class="mt-5 flex flex-wrap items-center gap-3">
        <div class="relative inline-flex items-center">
          <select
            :value="catalog.filters.sunlight"
            class="cursor-pointer rounded-full border border-line bg-card py-2.5 pr-8.5 pl-4 font-serif text-sm text-ink"
            @change="onSelect('sunlight', $event)"
          >
            <option v-for="opt in sunlightOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <span class="pointer-events-none absolute right-3.5 text-[10px] text-sage">▾</span>
        </div>
        <div class="relative inline-flex items-center">
          <select
            :value="catalog.filters.watering"
            class="cursor-pointer rounded-full border border-line bg-card py-2.5 pr-8.5 pl-4 font-serif text-sm text-ink"
            @change="onSelect('watering', $event)"
          >
            <option v-for="opt in wateringOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <span class="pointer-events-none absolute right-3.5 text-[10px] text-sage">▾</span>
        </div>
        <div class="relative inline-flex items-center">
          <select
            :value="catalog.filters.cycle"
            class="cursor-pointer rounded-full border border-line bg-card py-2.5 pr-8.5 pl-4 font-serif text-sm text-ink"
            @change="onSelect('cycle', $event)"
          >
            <option v-for="opt in cycleOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <span class="pointer-events-none absolute right-3.5 text-[10px] text-sage">▾</span>
        </div>
        <div class="relative inline-flex items-center">
          <select
            :value="catalog.filters.hardiness"
            class="cursor-pointer rounded-full border border-line bg-card py-2.5 pr-8.5 pl-4 font-serif text-sm text-ink"
            @change="onSelect('hardiness', $event)"
          >
            <option v-for="opt in hardinessOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <span class="pointer-events-none absolute right-3.5 text-[10px] text-sage">▾</span>
        </div>
        <button
          type="button"
          class="cursor-pointer rounded-full border px-4.25 py-2.5 font-serif text-sm transition-all duration-250"
          :class="
            catalog.filters.indoor ? 'border-forest bg-forest text-paper' : 'border-line bg-transparent text-ink'
          "
          @click="catalog.setFilter('indoor', !catalog.filters.indoor)"
        >
          {{ t.tg_indoor }}
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-full border px-4.25 py-2.5 font-serif text-sm transition-all duration-250"
          :class="
            catalog.filters.edible ? 'border-forest bg-forest text-paper' : 'border-line bg-transparent text-ink'
          "
          @click="catalog.setFilter('edible', !catalog.filters.edible)"
        >
          {{ t.tg_edible }}
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-full border px-4.25 py-2.5 font-serif text-sm transition-all duration-250"
          :class="
            catalog.filters.poisonous ? 'border-forest bg-forest text-paper' : 'border-line bg-transparent text-ink'
          "
          @click="catalog.setFilter('poisonous', !catalog.filters.poisonous)"
        >
          {{ t.tg_toxic }}
        </button>
        <button
          v-if="catalog.hasFilters"
          type="button"
          class="cursor-pointer border-none bg-none px-1.5 py-2.5 font-mono text-[11px] tracking-wide text-clay uppercase"
          @click="catalog.clearFilters"
        >
          ✕ {{ t.cat_clear }}
        </button>
      </div>
    </div>

    <div v-if="catalog.status === 'loading'" class="mt-10 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6.5">
      <LoadingSkeleton v-for="n in 6" :key="n" />
    </div>
    <div
      v-else-if="catalog.results.length > 0"
      class="mt-10 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6.5"
    >
      <PlantCard v-for="plant in catalog.results" :key="plant.id" :plant="plant" show-meters />
    </div>
    <EmptyState
      v-else
      :message="t.cat_empty"
      :action-label="t.cat_clear"
      @action="catalog.clearFilters"
    />
  </section>
</template>
