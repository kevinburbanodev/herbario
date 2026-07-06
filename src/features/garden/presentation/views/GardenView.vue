<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLanguage } from '@/shared/i18n/language'
import { useGardenStore } from '../garden.store'
import EmptyState from '@/shared/ui/EmptyState.vue'
import GardenRow from '../components/GardenRow.vue'

const { t } = useLanguage()
const gardenStore = useGardenStore()
const router = useRouter()
</script>

<template>
  <section class="mx-auto max-w-[1180px] px-5 pt-30 pb-22.5 sm:px-16">
    <div class="font-mono text-xs tracking-[0.4em] text-moss uppercase">{{ t.garden_kicker }}</div>
    <h1 class="mt-2.5 mb-2 font-display text-[clamp(40px,7vw,84px)] leading-[0.95] text-forest">
      {{ t.garden_title }}
    </h1>
    <p class="mb-10 max-w-[52ch] text-lg leading-[1.55] text-ink/78">{{ t.garden_lead }}</p>

    <EmptyState
      v-if="gardenStore.entries.length === 0"
      :message="t.garden_empty"
      :action-label="`${t.hero_cta} →`"
      @action="router.push('/catalog')"
    />
    <div v-else class="grid gap-4">
      <GardenRow v-for="entry in gardenStore.entries" :key="entry.id" :entry="entry" />
    </div>
  </section>
</template>
