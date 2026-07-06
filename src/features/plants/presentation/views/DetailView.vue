<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguage } from '@/shared/i18n/language'
import { useDetailStore } from '../detail.store'
import { useGardenStore } from '@/features/garden/presentation/garden.store'
import { levelPct, sunLevel, waterLevel, maintenancePct, growthPct } from '../../domain/plant-metrics'
import { specimenTag } from '@/shared/lib/format'
import LoadingSkeleton from '@/shared/ui/LoadingSkeleton.vue'
import HardinessZoneBar from '../components/HardinessZoneBar.vue'
import CareGuideAccordion from '../components/CareGuideAccordion.vue'
import { composeCareGuide } from '../../domain/care-guide'

const route = useRoute()
const router = useRouter()
const { t, lang } = useLanguage()
const detailStore = useDetailStore()
const gardenStore = useGardenStore()

const id = computed(() => Number(route.params.id))

function load() {
  if (Number.isFinite(id.value)) void detailStore.loadDetail(id.value)
}

onMounted(load)
watch(id, load)

const detail = computed(() => detailStore.detail)
const inGarden = computed(() => (detail.value ? gardenStore.isSaved(detail.value.id) : false))

const flags = computed(() => {
  const d = detail.value
  if (!d) return []
  const list: { label: string; tone: 'good' | 'danger' | 'neutral' }[] = []
  if (d.indoor) list.push({ label: t.value.tag_indoor, tone: 'neutral' })
  const poison = d.poisonousToHumans || d.poisonousToPets
  list.push({ label: poison ? t.value.tag_toxic : t.value.tag_petsafe, tone: poison ? 'danger' : 'good' })
  if (d.edibleFruit || d.edibleLeaf) list.push({ label: t.value.tag_edible, tone: 'good' })
  if (d.medicinal) list.push({ label: t.value.tag_medicinal, tone: 'good' })
  if (d.droughtTolerant) list.push({ label: t.value.tag_drought, tone: 'neutral' })
  if (d.flowers) list.push({ label: t.value.tag_flowers, tone: 'neutral' })
  return list
})

function toneClasses(tone: 'good' | 'danger' | 'neutral') {
  if (tone === 'danger') return 'border-clay text-clay bg-clay/12'
  if (tone === 'good') return 'border-moss text-forest bg-moss/12'
  return 'border-line text-ink bg-transparent'
}

const stats = computed(() => {
  const d = detail.value
  if (!d) return []
  return [
    {
      label: t.value.stat_water,
      value: d.watering || '—',
      pct: levelPct(waterLevel(d.watering)),
      color: '#5C9BC0',
      note: d.wateringBenchmark ? `≈ ${d.wateringBenchmark}` : '',
    },
    {
      label: t.value.stat_sun,
      value: d.sunlight.join(', ') || '—',
      pct: levelPct(sunLevel(d.sunlight)),
      color: '#D9A93C',
      note: '',
    },
    {
      label: t.value.stat_maint,
      value: d.maintenance || '—',
      pct: maintenancePct(d.maintenance),
      color: '#7C8F6B',
      note: d.careLevel || '',
    },
    {
      label: t.value.stat_growth,
      value: d.growthRate || '—',
      pct: growthPct(d.growthRate),
      color: '#5B7A3D',
      note: '',
    },
  ]
})

const attrs = computed(() => {
  const d = detail.value
  if (!d) return []
  const list: { label: string; value: string }[] = []
  const add = (label: string, value: string) => {
    if (value && value.trim()) list.push({ label, value })
  }
  add(t.value.a_cycle, d.cycle)
  add(t.value.a_dims, d.dimensionsText)
  add(t.value.a_prop, d.propagation.join(', '))
  add(t.value.a_soil, d.soil.join(', '))
  add(t.value.a_pruning, d.pruningMonths.join(', '))
  add(t.value.a_attracts, d.attracts.join(', '))
  add(t.value.a_pests, d.pestSusceptibility.join(', '))
  add(t.value.a_anatomy, d.anatomy.map((a) => `${a.part} (${a.colors.join(', ')})`).join('; '))
  return list
})

const guideTitles = computed(() => ({
  watering: t.value.guide_watering,
  sunlight: t.value.guide_sunlight,
  soil: t.value.guide_soil,
  pruning: t.value.guide_pruning,
}))

const guideSections = computed(() => (detail.value ? composeCareGuide(detail.value, lang.value, guideTitles.value) : []))

function goBack() {
  router.back()
}

function toggleGarden() {
  if (detail.value) gardenStore.toggle(detail.value)
}
</script>

<template>
  <section class="pt-24 pb-22.5">
    <div class="mx-auto max-w-[1240px] px-5 sm:px-16">
      <button
        type="button"
        class="cursor-pointer border-none bg-none py-2 font-mono text-xs tracking-wide text-forest uppercase"
        @click="goBack"
      >
        ← {{ t.back }}
      </button>
    </div>

    <div v-if="detailStore.status === 'loading'" class="mx-auto mt-6.5 max-w-[1240px] px-5 sm:px-16">
      <LoadingSkeleton aspect="auto" rounded="rounded-md" style="height: 60vh" />
    </div>

    <div v-else-if="detail">
      <div class="mx-auto mt-5.5 grid max-w-[1240px] grid-cols-1 items-stretch gap-0 px-5 sm:px-16 lg:grid-cols-[1.05fr_1fr]">
        <div
          class="relative min-h-[340px] overflow-hidden rounded-md sm:min-h-[420px] lg:min-h-[560px]"
          :style="{ background: `linear-gradient(155deg, oklch(0.56 0.12 ${detail.hue}), oklch(0.27 0.09 ${detail.hue}))` }"
        >
          <div
            class="absolute inset-0 mix-blend-overlay"
            style="background-image: repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 16px)"
          ></div>
          <img v-if="detail.image" :src="detail.image" alt="" class="absolute inset-0 h-full w-full object-cover" />
          <div
            class="absolute top-5 left-5 rounded-full bg-[rgba(24,42,32,0.32)] px-3 py-1.5 font-mono text-[11px] tracking-wide text-white/90 backdrop-blur-sm"
          >
            {{ specimenTag(detail.id) }}
          </div>
        </div>
        <div class="px-0 py-2 lg:px-8">
          <div class="font-mono text-[11px] tracking-wide text-moss uppercase">
            {{ detail.family }} · {{ detail.type }}
          </div>
          <h1 class="mt-3 mb-1.5 font-display text-[clamp(38px,5.4vw,72px)] leading-[0.98] text-forest">
            {{ detail.commonName }}
          </h1>
          <div class="font-serif text-xl text-ink/70 italic">{{ detail.scientificNames.join(', ') }}</div>
          <div v-if="detail.origin.length" class="mt-3 font-mono text-xs tracking-wide text-sage">
            ↝ {{ detail.origin.join(', ') }}
          </div>
          <p class="my-5.5 text-lg leading-[1.62] text-ink/86">{{ detail.description }}</p>
          <div class="mb-6 flex flex-wrap gap-2.5">
            <span
              v-for="flag in flags"
              :key="flag.label"
              class="rounded-full border px-3.5 py-1.75 font-serif text-sm"
              :class="toneClasses(flag.tone)"
              >{{ flag.label }}</span
            >
          </div>
          <button
            type="button"
            class="cursor-pointer rounded-full border-none px-7 py-3.5 font-serif text-[17px] transition-transform duration-300 hover:-translate-y-0.5"
            :class="inGarden ? 'bg-moss text-paper' : 'bg-forest text-paper'"
            @click="toggleGarden"
          >
            {{ inGarden ? t.inGarden : t.addGarden }}
          </button>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-[1240px] px-5 sm:px-16">
        <div class="flex items-baseline gap-3.5 border-b border-line pb-3">
          <span class="font-mono text-xs text-sage">01</span>
          <h2 class="font-display text-[clamp(26px,3.6vw,40px)] text-forest">{{ t.sec_care }}</h2>
        </div>
        <div class="mt-7.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6.5">
          <div v-for="stat in stats" :key="stat.label" v-reveal>
            <div class="font-mono text-[11px] tracking-wide text-sage uppercase">{{ stat.label }}</div>
            <div class="mt-2 mb-3 font-display text-[27px] text-forest">{{ stat.value }}</div>
            <div class="h-1.25 overflow-hidden rounded-sm bg-line">
              <div class="h-1.25 rounded-sm" :style="{ width: `${stat.pct}%`, background: stat.color }"></div>
            </div>
            <div v-if="stat.note" class="mt-2 font-serif text-[13px] text-ink/60 italic">{{ stat.note }}</div>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-[1240px] px-5 sm:px-16">
        <div class="flex items-baseline gap-3.5 border-b border-line pb-3">
          <span class="font-mono text-xs text-sage">02</span>
          <h2 class="font-display text-[clamp(26px,3.6vw,40px)] text-forest">{{ t.sec_botany }}</h2>
        </div>
        <div class="mt-7.5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px border border-line bg-line">
          <div v-for="attr in attrs" :key="attr.label" v-reveal class="bg-card px-5.5 pt-5.5 pb-6.5">
            <div class="font-mono text-[10.5px] tracking-wide text-moss uppercase">{{ attr.label }}</div>
            <div class="mt-2.5 font-serif text-[17px] leading-[1.45] text-ink">{{ attr.value }}</div>
          </div>
        </div>
      </div>

      <div v-if="detail.hardiness" class="mx-auto mt-14 max-w-[1240px] px-5 sm:px-16">
        <HardinessZoneBar :min="detail.hardiness.min" :max="detail.hardiness.max" />
      </div>

      <div class="mx-auto mt-16 max-w-[1240px] px-5 sm:px-16">
        <div class="flex items-baseline gap-3.5 border-b border-line pb-3">
          <span class="font-mono text-xs text-sage">03</span>
          <h2 class="font-display text-[clamp(26px,3.6vw,40px)] text-forest">{{ t.sec_guide }}</h2>
        </div>
        <CareGuideAccordion :sections="guideSections" />
      </div>
    </div>
  </section>
</template>
