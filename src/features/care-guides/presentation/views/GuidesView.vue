<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useLanguage } from '@/shared/i18n/language'
import { useGuidesStore } from '../guides.store'
import { specimenTag } from '@/shared/lib/format'
import LoadingSkeleton from '@/shared/ui/LoadingSkeleton.vue'

const { t, lang } = useLanguage()
const guides = useGuidesStore()

const guideTitles = computed(() => ({
  watering: t.value.guide_watering,
  sunlight: t.value.guide_sunlight,
  soil: t.value.guide_soil,
  pruning: t.value.guide_pruning,
}))

function pick(id: number) {
  void guides.select(id, lang.value, guideTitles.value)
}

onMounted(() => {
  if (guides.selectedId != null) pick(guides.selectedId)
})

watch(lang, () => {
  if (guides.selectedId != null) pick(guides.selectedId)
})
</script>

<template>
  <section class="mx-auto max-w-[1240px] px-5 pt-30 pb-22.5 sm:px-16">
    <div class="font-mono text-xs tracking-[0.4em] text-moss uppercase">{{ t.guides_kicker }}</div>
    <h1 class="mt-2.5 mb-2 font-display text-[clamp(40px,7vw,84px)] leading-[0.95] text-forest">
      {{ t.guides_title }}
    </h1>
    <p class="mb-8.5 max-w-[52ch] text-lg leading-[1.55] text-ink/78">{{ t.guides_lead }}</p>

    <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[320px_1fr]">
      <div class="lg:sticky lg:top-24">
        <div class="mb-4.5 flex items-center gap-2.5 rounded-full border-[1.5px] border-forest bg-card py-1.25 pr-1.5 pl-4.5">
          <span class="text-sage">⌕</span>
          <input
            v-model="guides.query"
            :placeholder="t.guides_search"
            class="flex-1 border-none bg-none py-2 font-serif text-base text-ink outline-none"
          />
        </div>
        <div class="max-h-[60vh] overflow-auto border-t border-line">
          <button
            v-for="plant in guides.filteredDirectory"
            :key="plant.id"
            type="button"
            class="flex w-full cursor-pointer items-center gap-3.25 border-none border-b border-line bg-transparent px-3.5 py-3.75 text-left hover:bg-[#EAE4D5]"
            :class="{ 'bg-[#EAE4D5]': String(plant.id) === String(guides.selectedId) }"
            @click="pick(plant.id)"
          >
            <span
              class="h-8.5 w-8.5 flex-none rounded-sm"
              :style="{ background: `linear-gradient(150deg, oklch(0.55 0.12 ${plant.hue}), oklch(0.3 0.09 ${plant.hue}))` }"
            ></span>
            <span>
              <span class="block font-serif text-base text-forest">{{ plant.commonName }}</span>
              <span class="block font-serif text-[12.5px] text-sage italic">{{ plant.scientificNames[0] }}</span>
            </span>
          </button>
        </div>
      </div>

      <div>
        <LoadingSkeleton v-if="guides.status === 'loading'" aspect="auto" rounded="rounded-md" style="height: 50vh" />
        <article v-else-if="guides.selectedDetail">
          <div class="font-mono text-xs tracking-wide text-sage uppercase">
            {{ specimenTag(guides.selectedDetail.id) }} · {{ guides.selectedDetail.scientificNames[0] }}
          </div>
          <h2 class="mt-2.5 mb-6.5 font-display text-[clamp(30px,4.6vw,54px)] text-forest">
            {{ guides.selectedDetail.commonName }}
          </h2>
          <div
            v-for="(section, index) in guides.sections"
            :key="section.type"
            v-reveal
            class="mb-10 border-b border-line pb-10"
          >
            <div class="flex items-baseline gap-3.5">
              <span class="font-mono text-[13px] text-moss">0{{ index + 1 }}</span>
              <h3 class="font-display text-[28px] text-forest">{{ section.title }}</h3>
            </div>
            <p class="mt-4 max-w-[70ch] text-lg leading-[1.7] text-ink/85">{{ section.text }}</p>
          </div>
          <RouterLink
            :to="`/plants/${guides.selectedDetail.id}`"
            class="inline-block rounded-full border border-forest px-6.5 py-3 font-serif text-base text-forest hover:bg-forest hover:text-paper"
          >
            {{ t.guides_full }} →
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>
