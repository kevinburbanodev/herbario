<script setup lang="ts">
defineProps<{ message: string; actionLabel?: string }>()
const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="px-5 py-22 text-center text-sage">
    <div class="font-display text-[34px] text-forest">{{ message }}</div>
    <button
      v-if="actionLabel"
      type="button"
      class="mt-4.5 cursor-pointer rounded-full border border-forest bg-transparent px-6 py-2.75 font-serif text-[15px] text-forest"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
