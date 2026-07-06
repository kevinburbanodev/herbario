<script setup lang="ts">
import AppNav from '@/shared/layout/AppNav.vue'
import AppFooter from '@/shared/layout/AppFooter.vue'
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-paper text-ink">
    <div class="grain-overlay" aria-hidden="true"></div>
    <AppNav />
    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
