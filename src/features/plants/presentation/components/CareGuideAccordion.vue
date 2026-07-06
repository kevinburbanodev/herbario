<script setup lang="ts">
import { ref } from 'vue'
import type { CareGuideSection } from '../../domain/care-guide'

defineProps<{ sections: CareGuideSection[] }>()
const openIndex = ref(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<template>
  <div class="mt-3.5">
    <div v-for="(section, index) in sections" :key="section.type" class="border-b border-line">
      <button
        type="button"
        class="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-none py-5.5 text-left"
        @click="toggle(index)"
      >
        <span class="flex items-baseline gap-4">
          <span class="font-mono text-xs text-moss">0{{ index + 1 }}</span>
          <span class="font-display text-[23px] text-forest">{{ section.title }}</span>
        </span>
        <span
          class="font-serif text-2xl text-sage transition-transform duration-300"
          :style="{ transform: openIndex === index ? 'rotate(45deg)' : 'none' }"
          >+</span
        >
      </button>
      <p v-if="openIndex === index" class="mb-6 max-w-[75ch] text-[17px] leading-[1.65] text-ink/82">
        {{ section.text }}
      </p>
    </div>
  </div>
</template>
