/** Maps Perenual's free-text watering/sunlight/maintenance levels onto a
 * 0-3 (or 0-100%) scale so they can drive meters and progress bars. */

export function waterLevel(watering?: string | null): number {
  const w = (watering || '').toLowerCase()
  if (w.includes('frequent')) return 3
  if (w.includes('average')) return 2
  if (w.includes('minimum')) return 1
  return 0
}

export function sunLevel(sunlight?: string[] | null): number {
  const s = (sunlight || []).join(' ').toLowerCase()
  if (s.includes('full sun')) return 3
  if (s.includes('part') || s.includes('filtered')) return 2
  if (s.includes('shade')) return 1
  return 2
}

export function levelPct(level: number): number {
  return Math.round((level / 3) * 100)
}

export function maintenancePct(maintenance?: string | null): number {
  const m = (maintenance || '').toLowerCase()
  if (m.includes('high')) return 100
  if (m.includes('mod')) return 60
  return 30
}

export function growthPct(growthRate?: string | null): number {
  const g = (growthRate || '').toLowerCase()
  if (g.includes('high')) return 100
  if (g.includes('mod')) return 60
  return 30
}

/** Approximate days between waterings, used for the garden's next-watering
 * countdown. Prefers the API's own benchmark text ("7-10 days") when present. */
export function wateringIntervalDays(watering?: string | null, benchmark?: string | null): number {
  if (benchmark) {
    const match = benchmark.match(/\d+/)
    if (match) return parseInt(match[0], 10)
  }
  const level = waterLevel(watering)
  if (level === 3) return 4
  if (level === 2) return 7
  if (level === 1) return 16
  return 10
}
