<script setup lang="ts">
import type { Pest } from '../../domain/pest.entity'
import { specimenTag } from '@/shared/lib/format'
import { useLanguage } from '@/shared/i18n/language'

defineProps<{ pest: Pest }>()
const { t } = useLanguage()
</script>

<template>
  <div v-reveal class="flex flex-col overflow-hidden rounded-md border border-line bg-card">
    <div
      class="h-2"
      :style="{ background: `linear-gradient(90deg, oklch(0.6 0.14 ${pest.hue}), oklch(0.45 0.12 ${pest.hue}))` }"
    ></div>
    <div class="flex flex-1 flex-col px-5.5 pt-5.5 pb-6">
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-display text-2xl leading-[1.05] text-forest">{{ pest.commonName }}</h3>
        <span class="pt-1.5 font-mono text-[10px] whitespace-nowrap text-sage">{{ specimenTag(pest.id) }}</span>
      </div>
      <div v-if="pest.scientificName" class="mt-0.5 font-serif text-sm text-sage italic">
        {{ pest.scientificName }}
      </div>
      <div v-if="pest.hosts.length" class="mt-3 font-mono text-[10.5px] tracking-wide text-moss uppercase">
        {{ t.pests_host }}: {{ pest.hosts.join(', ') }}
      </div>
      <p v-if="pest.description" class="mt-3.5 text-[15.5px] leading-[1.55] text-ink/82">{{ pest.description }}</p>
      <div v-if="pest.solution" class="mt-4 rounded-r-md border-l-3 border-moss bg-moss/[0.09] px-4 py-3.5">
        <div class="font-mono text-[10px] tracking-wide text-moss uppercase">{{ t.pests_solution }}</div>
        <p class="mt-1.5 text-[15px] leading-[1.55] text-ink/86">{{ pest.solution }}</p>
      </div>
    </div>
  </div>
</template>
