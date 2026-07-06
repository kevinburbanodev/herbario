<script setup lang="ts">
import { useLanguage } from '@/shared/i18n/language'

const { t } = useLanguage()
</script>

<template>
  <footer class="mt-5 border-t border-line px-5 py-11 sm:px-16">
    <div class="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4">
      <div class="font-display text-xl text-forest">Herbario<span class="text-moss">·</span>Vivo</div>
      <div class="font-mono text-[11px] tracking-wide text-sage uppercase">
        {{ t.footer }} ·
        <a href="https://perenual.com/docs/api" class="text-moss">Perenual API</a>
      </div>
    </div>
  </footer>
</template>
