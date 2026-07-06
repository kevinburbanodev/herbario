export interface PlantSummary {
  id: number
  commonName: string
  scientificNames: string[]
  hue: number
  image: string | null
  watering: string | null
  sunlight: string[]
  indoor: boolean
  poisonous: boolean
}

export interface PlantAnatomyPart {
  part: string
  colors: string[]
}

export interface PlantDetail extends PlantSummary {
  family: string
  type: string
  origin: string[]
  description: string
  cycle: string
  wateringBenchmark: string | null
  maintenance: string | null
  careLevel: string | null
  growthRate: string | null
  droughtTolerant: boolean
  flowers: boolean
  edibleFruit: boolean
  edibleLeaf: boolean
  medicinal: boolean
  poisonousToHumans: boolean
  poisonousToPets: boolean
  dimensionsText: string
  pruningMonths: string[]
  propagation: string[]
  soil: string[]
  attracts: string[]
  pestSusceptibility: string[]
  anatomy: PlantAnatomyPart[]
  hardiness: { min: number; max: number } | null
}
