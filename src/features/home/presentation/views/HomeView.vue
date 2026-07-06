<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/shared/i18n/language'
import { useParallax } from '@/shared/lib/parallax'
import { CURATED_PLANTS } from '@/features/plants/infrastructure/curated-plants.data'
import { toSummary } from '@/features/plants/infrastructure/perenual-plant.repository'
import PlantCard from '@/features/plants/presentation/components/PlantCard.vue'

const { t } = useLanguage()
const router = useRouter()
useParallax()

const featured = computed(() => CURATED_PLANTS.slice(0, 6).map(toSummary))

const tiles = computed(() => [
  { num: '01', title: t.value.tl_cat_t, desc: t.value.tl_cat_d, cta: t.value.tl_cat_c, to: '/catalog' },
  { num: '02', title: t.value.tl_guide_t, desc: t.value.tl_guide_d, cta: t.value.tl_guide_c, to: '/guides' },
  { num: '03', title: t.value.tl_pest_t, desc: t.value.tl_pest_d, cta: t.value.tl_pest_c, to: '/pests' },
  { num: '04', title: t.value.tl_garden_t, desc: t.value.tl_garden_d, cta: t.value.tl_garden_c, to: '/garden' },
])

const stats = computed(() => [
  { value: '10,000+', label: t.value.s1 },
  { value: '240+', label: t.value.s2 },
  { value: '×4', label: t.value.s3 },
])
</script>

<template>
  <div>
    <section class="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pt-30 pb-15 sm:px-16">
      <div
        aria-hidden="true"
        data-parallax-depth="0.9"
        class="animate-float-a absolute top-[8%] right-[6%] h-85 w-85 rounded-full opacity-90 blur-[2px]"
        style="background: radial-gradient(circle at 35% 30%, oklch(0.72 0.11 130), oklch(0.42 0.12 145))"
      ></div>
      <div
        aria-hidden="true"
        data-parallax-depth="1.7"
        class="animate-float-b absolute bottom-[6%] left-[-40px] h-55 w-55 rounded-full opacity-85"
        style="background: radial-gradient(circle at 40% 35%, oklch(0.66 0.1 100), oklch(0.38 0.1 120))"
      ></div>
      <div
        aria-hidden="true"
        data-parallax-depth="2.6"
        class="animate-float-c absolute top-[24%] left-[12%] h-22.5 w-22.5 rounded-full opacity-55"
        style="background: oklch(0.6 0.13 60)"
      ></div>
      <div
        aria-hidden="true"
        data-parallax-depth="1.2"
        class="animate-float-c absolute bottom-[22%] right-[20%] h-14 w-14 rounded-full border border-moss opacity-40"
      ></div>

      <div class="relative z-2 mx-auto w-full max-w-[1180px]">
        <div class="animate-fade-up font-mono text-xs tracking-[0.4em] text-moss uppercase">{{ t.hero_kicker }}</div>
        <h1 class="mt-4.5 font-display text-[clamp(52px,10.5vw,158px)] leading-[0.92] font-normal tracking-[-0.02em] text-forest">
          <span class="animate-fade-up block">{{ t.hero_l1 }}</span>
          <span class="animate-fade-up block text-ink italic">{{ t.hero_l2 }}</span>
        </h1>
        <div class="animate-fade-up mt-8.5 flex flex-wrap items-end gap-9.5">
          <p class="m-0 max-w-110 text-lg leading-[1.55] text-ink/80">{{ t.hero_lead }}</p>
          <div class="flex flex-wrap gap-3.5">
            <button
              type="button"
              class="cursor-pointer rounded-full border-none bg-forest px-7.5 py-3.75 font-serif text-[17px] text-paper transition-all duration-300 hover:-translate-y-0.75 hover:bg-moss"
              @click="router.push('/catalog')"
            >
              {{ t.hero_cta }} →
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-full border border-forest bg-transparent px-7.5 py-3.75 font-serif text-[17px] text-forest transition-colors duration-300 hover:bg-forest hover:text-paper"
              @click="router.push('/pests')"
            >
              {{ t.hero_cta2 }}
            </button>
          </div>
        </div>
      </div>
      <div class="animate-pulse-soft absolute bottom-6.5 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-sage uppercase">
        ↓ scroll
      </div>
    </section>

    <section class="mx-auto max-w-[1240px] px-5 pt-10 pb-22.5 sm:px-16">
      <div v-reveal class="flex flex-wrap items-baseline justify-between gap-2.5 border-b border-line pb-4">
        <h2 class="font-display text-[clamp(30px,4.6vw,50px)] text-forest">{{ t.feat_title }}</h2>
        <div class="font-mono text-xs tracking-[0.24em] text-sage uppercase">{{ t.feat_kicker }}</div>
      </div>
      <div class="mt-9 grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))] gap-6.5">
        <PlantCard v-for="plant in featured" :key="plant.id" :plant="plant" />
      </div>
    </section>

    <section class="bg-forest px-5 py-22.5 text-paper sm:px-16">
      <div class="mx-auto max-w-[1180px]">
        <div v-reveal class="font-mono text-xs tracking-[0.4em] text-sage uppercase">{{ t.explore_kicker }}</div>
        <h2 v-reveal class="mt-3 mb-11.5 max-w-[15ch] font-display text-[clamp(32px,5.5vw,64px)] text-paper">
          {{ t.explore_title }}
        </h2>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border border-paper/16 bg-paper/16">
          <button
            v-for="tile in tiles"
            :key="tile.num"
            v-reveal
            type="button"
            class="cursor-pointer border-none bg-forest px-7 pt-8.5 pb-10 text-left text-paper transition-colors duration-400 hover:bg-forest-dark"
            @click="router.push(tile.to)"
          >
            <div class="font-mono text-[13px] tracking-[0.2em] text-sage">{{ tile.num }}</div>
            <div class="mt-5.5 mb-2.5 font-display text-[28px]">{{ tile.title }}</div>
            <div class="text-[15.5px] leading-[1.5] text-paper/72">{{ tile.desc }}</div>
            <div class="mt-5 font-mono text-xs tracking-[0.2em] text-paper">{{ tile.cta }} →</div>
          </button>
        </div>
        <div class="mt-17.5 flex flex-wrap gap-11 border-t border-paper/16 pt-9">
          <div v-for="stat in stats" :key="stat.label" v-reveal>
            <div class="font-display text-[clamp(38px,5vw,58px)] leading-none text-paper">{{ stat.value }}</div>
            <div class="mt-2 font-mono text-[11px] tracking-[0.24em] text-sage uppercase">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
