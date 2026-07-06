import type { Directive } from 'vue'

// Fades an element up into place the first time it scrolls into view.
// Usage: <div v-reveal> ... </div>
let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
  }
  return observer
}

export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('reveal')
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
