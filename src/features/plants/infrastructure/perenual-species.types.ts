// Shape of a Perenual species-list / species-details response, trimmed to
// the fields this app actually reads. Both list items and detail payloads
// are described by the same (optional-heavy) interface since Perenual's
// list endpoint already returns most of these fields inline.
export interface PerenualSpeciesRaw {
  id: number
  common_name?: string | null
  scientific_name?: string[] | null
  family?: string | null
  type?: string | null
  origin?: string[] | null
  cycle?: string | null
  watering?: string | null
  watering_general_benchmark?: { value?: string; unit?: string } | null
  watering_benchmark?: string | null
  sunlight?: string[] | null
  indoor?: boolean | null
  tropical?: boolean | null
  maintenance?: string | null
  care_level?: string | null
  growth_rate?: string | null
  drought_tolerant?: boolean | null
  flowers?: boolean | null
  edible_fruit?: boolean | null
  edible_leaf?: boolean | null
  cuisine?: boolean | null
  medicinal?: boolean | null
  poisonous_to_humans?: boolean | number | null
  poisonous_to_pets?: boolean | number | null
  dimensions?:
    | string
    | { min_value?: number; max_value?: number; unit?: string }
    | null
  pruning_month?: string[] | null
  propagation?: string[] | null
  soil?: string[] | null
  attracts?: string[] | null
  pest_susceptibility?: string[] | null
  plant_anatomy?: { part: string; color?: string[] }[] | null
  hardiness?: { min?: string | number; max?: string | number } | null
  description?: unknown
  default_image?: {
    regular_url?: string | null
    medium_url?: string | null
    original_url?: string | null
    small_url?: string | null
    thumbnail?: string | null
  } | null
  hue?: number | null
}
