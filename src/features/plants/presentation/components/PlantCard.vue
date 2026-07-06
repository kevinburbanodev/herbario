<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PlantSummary } from '../../domain/plant.entity'
import { levelPct, sunLevel, waterLevel } from '../../domain/plant-metrics'
import { specimenTag } from '@/shared/lib/format'
import { useLanguage } from '@/shared/i18n/language'

const props = withDefaults(
  defineProps<{ plant: PlantSummary; showMeters?: boolean }>(),
  { showMeters: false },
)
const { t } = useLanguage()
const router = useRouter()

const waterPct = computed(() => levelPct(waterLevel(props.plant.watering)))
const sunPct = computed(() => levelPct(sunLevel(props.plant.sunlight)))

function open() {
  void router.push(`/plants/${props.plant.id}`)
}
</script>

<template>
  <button type="button" class="group block w-full cursor-pointer border-none bg-none p-0 text-left" @click="open">
    <div
      class="relative aspect-[3/4] overflow-hidden rounded-[5px] shadow-[0_12px_30px_-18px_rgba(24,42,32,0.5)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_44px_-20px_rgba(24,42,32,0.55)]"
      :style="{
        background: `linear-gradient(155deg, oklch(0.55 0.12 ${plant.hue}), oklch(0.29 0.09 ${plant.hue}))`,
      }"
    >
      <div
        class="absolute inset-0 mix-blend-overlay"
        style="background-image: repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 15px)"
      ></div>
      <img
        v-if="plant.image"
        :src="plant.image"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
      <div
        class="absolute top-3 left-3 rounded-full bg-[rgba(24,42,32,0.3)] px-2 py-1 font-mono text-[10px] tracking-wide text-white/85 backdrop-blur-sm"
      >
        {{ specimenTag(plant.id) }}
      </div>
      <div
        v-if="plant.poisonous && showMeters"
        class="absolute top-3 right-3 rounded-full bg-clay px-2 py-1 font-mono text-[9px] tracking-wide text-white"
      >
        {{ t.tag_toxic }}
      </div>
      <div
        class="absolute right-0 bottom-0 left-0 px-3.5 pt-4.5 pb-3.5"
        style="background: linear-gradient(to top, rgba(20, 32, 24, 0.85), transparent)"
      >
        <div class="font-display text-[21px] leading-[1.05] text-paper">{{ plant.commonName }}</div>
        <div class="mt-0.5 font-serif text-[13.5px] text-paper/72 italic">
          {{ plant.scientificNames[0] }}
        </div>
        <div v-if="showMeters" class="mt-2.75 flex gap-3.5">
          <div class="flex-1">
            <div class="font-mono text-[8.5px] tracking-wide text-paper/60 uppercase">
              {{ t.meter_water }}
            </div>
            <div class="mt-1 h-0.75 rounded-sm bg-paper/25">
              <div class="h-0.75 rounded-sm bg-[#9FD0E8]" :style="{ width: `${waterPct}%` }"></div>
            </div>
          </div>
          <div class="flex-1">
            <div class="font-mono text-[8.5px] tracking-wide text-paper/60 uppercase">
              {{ t.meter_sun }}
            </div>
            <div class="mt-1 h-0.75 rounded-sm bg-paper/25">
              <div class="h-0.75 rounded-sm bg-[#EBC65C]" :style="{ width: `${sunPct}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</template>
