<script setup lang="ts">
withDefaults(defineProps<{ aspect?: string; rounded?: string }>(), {
  aspect: '3/4',
  rounded: 'rounded-[5px]',
})
</script>

<template>
  <div
    class="animate-shimmer bg-gradient-to-r from-[#E7E1D2] via-[#F1EDE1] to-[#E7E1D2]"
    :class="[rounded]"
    :style="{ aspectRatio: aspect }"
  ></div>
</template>
