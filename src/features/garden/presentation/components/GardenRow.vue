<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { GardenEntry } from '../../domain/garden-entry.entity'
import { computeSchedule } from '../../domain/garden-schedule'
import { useLanguage } from '@/shared/i18n/language'
import { useGardenStore } from '../garden.store'

const props = defineProps<{ entry: GardenEntry }>()
const { t } = useLanguage()
const router = useRouter()
const gardenStore = useGardenStore()

const justWatered = computed(() => gardenStore.justWateredId === props.entry.id)
const schedule = computed(() => computeSchedule(props.entry, new Date(), justWatered.value))

const statusText = computed(() => {
  const s = schedule.value
  if (s.status === 'watered') return t.value.st_watered
  if (s.status === 'overdue') return `${t.value.st_overdue} · ${Math.abs(s.daysDiff)} ${t.value.days}`
  if (s.status === 'today') return t.value.st_today
  return `${t.value.st_in} ${s.daysDiff} ${t.value.days}`
})
const statusColor = computed(() => {
  const s = schedule.value.status
  if (s === 'watered') return 'var(--color-moss)'
  if (s === 'overdue' || s === 'today') return 'var(--color-clay)'
  return 'var(--color-forest)'
})

function open() {
  void router.push(`/plants/${props.entry.id}`)
}
</script>

<template>
  <div
    v-reveal
    class="relative grid grid-cols-1 items-center gap-4.5 overflow-hidden rounded-lg border border-line bg-card p-4.5 sm:px-5.5 md:grid-cols-[1.5fr_1fr_auto]"
  >
    <div class="absolute inset-y-0 left-0 w-1.25" :style="{ background: statusColor }"></div>
    <button type="button" class="flex cursor-pointer items-center gap-4 border-none bg-none p-0 text-left" @click="open">
      <span
        class="h-18.5 w-15 flex-none rounded-sm"
        :style="{ background: `linear-gradient(150deg, oklch(0.55 0.12 ${entry.hue}), oklch(0.3 0.09 ${entry.hue}))` }"
      ></span>
      <span>
        <span class="block font-display text-[23px] leading-[1.05] text-forest">{{ entry.name }}</span>
        <span class="mt-0.5 block font-serif text-sm text-sage italic">{{ entry.latin }}</span>
      </span>
    </button>
    <div>
      <div class="font-mono text-[10.5px] tracking-wide text-sage uppercase">{{ t.garden_schedule }}</div>
      <div class="mt-1 font-serif text-[17px]" :style="{ color: statusColor }">{{ statusText }}</div>
      <div class="mt-0.5 font-serif text-[13px] text-ink/60">
        {{ t.garden_every }} {{ entry.everyDays }} {{ t.days }}
      </div>
    </div>
    <div class="flex flex-row items-center gap-3 md:flex-col md:items-end md:gap-2">
      <button
        type="button"
        class="flex cursor-pointer items-center gap-2 rounded-full border-none bg-forest px-5 py-2.75 font-serif text-sm text-paper hover:bg-moss"
        @click="gardenStore.water(entry.id)"
      >
        <span :class="justWatered ? 'animate-drop inline-block' : 'inline-block'">💧</span>{{ t.garden_water }}
      </button>
      <button
        type="button"
        class="cursor-pointer border-none bg-none font-mono text-[10px] tracking-wide text-clay uppercase"
        @click="gardenStore.remove(entry.id)"
      >
        ✕ {{ t.garden_remove }}
      </button>
    </div>
  </div>
</template>
