import type { GardenEntry } from './garden-entry.entity'

export type ScheduleStatus = 'watered' | 'today' | 'overdue' | 'upcoming'

export interface GardenSchedule {
  status: ScheduleStatus
  daysDiff: number
}

/** Computes whether an entry needs watering today, is overdue, or is upcoming,
 * relative to a given "now" (passed in so this stays a pure, testable function). */
export function computeSchedule(entry: GardenEntry, now: Date, justWatered: boolean): GardenSchedule {
  const last = new Date(entry.lastWatered + 'T00:00:00')
  const next = new Date(last)
  next.setDate(next.getDate() + entry.everyDays)
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const daysDiff = Math.round((next.getTime() - startOfToday.getTime()) / 86400000)

  if (justWatered) return { status: 'watered', daysDiff }
  if (daysDiff < 0) return { status: 'overdue', daysDiff }
  if (daysDiff === 0) return { status: 'today', daysDiff }
  return { status: 'upcoming', daysDiff }
}
