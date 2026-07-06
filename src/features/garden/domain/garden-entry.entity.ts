export interface GardenEntry {
  id: number
  name: string
  latin: string
  hue: number
  everyDays: number
  /** ISO date (yyyy-mm-dd) of the last recorded watering. */
  lastWatered: string
}
