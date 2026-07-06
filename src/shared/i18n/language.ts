import { computed, ref } from 'vue'
import { dictionaries, type Lang } from './translations'

const STORAGE_KEY = 'herbario_lang'

function readInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') return stored
  } catch {
    // localStorage unavailable (SSR/private mode) — fall back to default
  }
  return 'es'
}

const lang = ref<Lang>(readInitialLang())

export function useLanguage() {
  const t = computed(() => dictionaries[lang.value])

  function setLang(next: Lang) {
    lang.value = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore persistence failures
    }
  }

  function toggleLang() {
    setLang(lang.value === 'es' ? 'en' : 'es')
  }

  return { lang, t, setLang, toggleLang }
}
