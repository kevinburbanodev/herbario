/** Title-cases a slug/name fragment, e.g. "full_sun" -> "Full Sun". */
export function toTitleCase(value?: string | null): string {
  if (!value) return ''
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b([a-z])/g, (_match, letter: string) => letter.toUpperCase())
}

/** Formats a catalog id as a specimen tag, e.g. 3 -> "N.º 0003". */
export function specimenTag(id: number | string): string {
  return 'N.º ' + String(id).padStart(4, '0')
}

/** Perenual sometimes returns a description as a string, an array of
 * {subtitle, description} sections, or a single {description} object.
 * Flattens all three shapes into one plain string, optionally capped. */
export function flattenText(value: unknown, cap?: number): string {
  let out: string
  if (!value) out = ''
  else if (typeof value === 'string') out = value
  else if (Array.isArray(value)) {
    out = value
      .map((entry) =>
        typeof entry === 'string'
          ? entry
          : ((entry as { description?: string; subtitle?: string })?.description ??
            (entry as { description?: string; subtitle?: string })?.subtitle ??
            ''),
      )
      .filter(Boolean)
      .join(' ')
  } else if (typeof value === 'object') {
    const obj = value as { description?: string; subtitle?: string }
    out = obj.description || obj.subtitle || ''
  } else {
    out = String(value)
  }
  out = out.trim()
  if (cap && out.length > cap) out = out.slice(0, cap).replace(/\s+\S*$/, '') + '…'
  return out
}
