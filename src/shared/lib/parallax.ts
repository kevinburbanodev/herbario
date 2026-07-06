import { onMounted, onUnmounted } from 'vue'

/** Nudges every [data-parallax-depth] element opposite the cursor, scaled by
 * its own depth value — used for the hero's floating background blobs. */
export function useParallax() {
  function handleMove(event: MouseEvent) {
    const mx = event.clientX / window.innerWidth - 0.5
    const my = event.clientY / window.innerHeight - 0.5
    document.querySelectorAll<HTMLElement>('[data-parallax-depth]').forEach((el) => {
      const depth = parseFloat(el.dataset.parallaxDepth || '1')
      el.style.transform = `translate(${mx * depth * 26}px, ${my * depth * 26}px)`
    })
  }

  onMounted(() => window.addEventListener('mousemove', handleMove, { passive: true }))
  onUnmounted(() => window.removeEventListener('mousemove', handleMove))
}
