<script setup lang="ts">
import { onMounted } from 'vue'
import { useLanguage } from '@/shared/i18n/language'
import { usePestsStore } from '../pests.store'
import PestCard from '../components/PestCard.vue'
import LoadingSkeleton from '@/shared/ui/LoadingSkeleton.vue'
import SourceBadge from '@/shared/ui/SourceBadge.vue'

const { t } = useLanguage()
const pests = usePestsStore()

onMounted(() => pests.ensureLoaded())
</script>

<template>
  <section class="mx-auto max-w-[1240px] px-5 pt-30 pb-22.5 sm:px-16">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div class="font-mono text-xs tracking-[0.4em] text-clay uppercase">{{ t.pests_kicker }}</div>
        <h1 class="mt-2.5 font-display text-[clamp(40px,7vw,84px)] leading-[0.95] text-forest">
          {{ t.pests_title }}
        </h1>
      </div>
      <SourceBadge :source="pests.source" />
    </div>
    <p class="mt-4 mb-7.5 max-w-[56ch] text-lg leading-[1.55] text-ink/78">{{ t.pests_lead }}</p>

    <div
      class="mb-9 flex max-w-140 items-center gap-3 rounded-full border-[1.5px] border-clay bg-card py-1.25 pr-1.5 pl-5"
    >
      <span class="text-clay">⌕</span>
      <input
        v-model="pests.query"
        :placeholder="t.pests_search"
        class="flex-1 border-none bg-none py-2 font-serif text-base text-ink outline-none sm:text-[17px]"
        @keydown.enter="pests.search(pests.query)"
      />
      <button
        type="button"
        class="cursor-pointer rounded-full border-none bg-clay px-5.5 py-2.5 font-serif text-sm text-white"
        @click="pests.search(pests.query)"
      >
        {{ t.cat_go }}
      </button>
    </div>

    <div v-if="pests.status === 'loading'" class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5.5">
      <LoadingSkeleton v-for="n in 4" :key="n" aspect="auto" rounded="rounded-md" style="height: 220px" />
    </div>
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5.5">
      <PestCard v-for="pest in pests.pests" :key="pest.id" :pest="pest" />
    </div>
  </section>
</template>
