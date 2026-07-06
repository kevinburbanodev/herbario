<script setup lang="ts">
import { computed } from 'vue'
import type { DataSource } from '@/shared/lib/data-source'
import { useLanguage } from '@/shared/i18n/language'

const props = defineProps<{ source: DataSource }>()
const { t } = useLanguage()

const label = computed(() => (props.source === 'live' ? t.value.live : t.value.sample))
const dotColor = computed(() => (props.source === 'live' ? 'var(--color-moss)' : 'var(--color-gold)'))
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border border-line px-2.75 py-1.25 font-mono text-[10px] tracking-wide text-forest uppercase"
  >
    <span class="h-1.75 w-1.75 rounded-full" :style="{ background: dotColor }"></span>
    {{ label }}
  </span>
</template>
