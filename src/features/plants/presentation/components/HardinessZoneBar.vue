<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '@/shared/i18n/language'

const props = defineProps<{ min: number; max: number }>()
const { t } = useLanguage()

const marks = computed(() =>
  Array.from({ length: 13 }, (_, i) => {
    const n = i + 1
    const active = n >= props.min && n <= props.max
    return { n, active }
  }),
)
</script>

<template>
  <div class="rounded-lg bg-forest px-6 py-8.5 text-paper sm:px-12">
    <div class="flex flex-wrap items-baseline justify-between gap-2.5">
      <h3 class="font-display text-2xl text-paper">{{ t.hardiness }}</h3>
      <span class="font-mono text-xs tracking-wide text-sage">{{ t.zone }} {{ min }}–{{ max }}</span>
    </div>
    <div class="mt-5.5 flex gap-1">
      <div v-for="mark in marks" :key="mark.n" class="flex-1 text-center">
        <div
          class="h-8.5 rounded-sm transition-colors duration-400"
          :style="{
            background: mark.active ? 'linear-gradient(180deg,#9FD07E,#5B7A3D)' : 'rgba(241,237,225,.14)',
          }"
        ></div>
        <div class="mt-1.5 font-mono text-[10px]" :style="{ color: mark.active ? '#F1EDE1' : 'rgba(241,237,225,.4)' }">
          {{ mark.n }}
        </div>
      </div>
    </div>
  </div>
</template>
