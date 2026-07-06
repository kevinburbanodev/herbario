<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/shared/i18n/language'
import { useGardenStore } from '@/features/garden/presentation/garden.store'

const NAV_ITEMS = [
  { to: '/', key: 'nav_home' as const },
  { to: '/catalog', key: 'nav_catalog' as const },
  { to: '/guides', key: 'nav_guides' as const },
  { to: '/pests', key: 'nav_pests' as const },
]

const router = useRouter()
const { t, lang, toggleLang } = useLanguage()
const gardenStore = useGardenStore()

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <nav
    class="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 transition-all duration-400 sm:px-16"
    :class="scrolled ? 'bg-paper/92 py-3 shadow-[0_1px_0_rgba(24,42,32,0.08)] backdrop-blur-md' : 'bg-transparent py-4.5'"
  >
    <button type="button" class="cursor-pointer border-none bg-none p-0 text-left" @click="router.push('/')">
      <div class="font-display text-2xl leading-none tracking-[0.02em] text-forest">
        Herbario<span class="text-moss">·</span>Vivo
      </div>
      <div class="mt-0.75 font-mono text-[9px] tracking-[0.42em] text-sage uppercase">Botanical Index</div>
    </button>

    <div class="flex items-center gap-3.5 sm:gap-6">
      <RouterLink
        v-for="item in NAV_ITEMS"
        :key="item.to"
        :to="item.to"
        class="relative hidden py-1 font-serif text-[15.5px] text-ink opacity-82 hover:opacity-100 md:inline"
        active-class="opacity-100 after:absolute after:inset-x-0 after:-bottom-0.75 after:h-0.5 after:bg-moss"
      >
        {{ t[item.key] }}
      </RouterLink>
      <button
        type="button"
        class="cursor-pointer rounded-full border border-line bg-card px-3.25 py-1.75 font-mono text-[11px] tracking-[0.12em] text-forest"
        @click="toggleLang"
      >
        {{ lang === 'es' ? 'ES / en' : 'es / EN' }}
      </button>
      <button
        type="button"
        class="flex cursor-pointer items-center gap-1.75 rounded-full border-none bg-forest px-4 py-2 font-serif text-sm text-paper hover:bg-moss"
        @click="router.push('/garden')"
      >
        <span class="font-mono text-xs">✿</span>{{ t.nav_garden }}
        <span
          v-if="gardenStore.count > 0"
          class="min-w-4.5 rounded-full bg-paper px-1.75 py-0.5 text-center font-mono text-[10px] text-forest"
          >{{ gardenStore.count }}</span
        >
      </button>
    </div>
  </nav>
</template>
