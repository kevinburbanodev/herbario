export interface CuratedDiseaseRaw {
  id: number
  hue: number
  common_name: string
  scientific_name: string
  host: string[]
  description: string
  solution: string
}

export const CURATED_DISEASES: CuratedDiseaseRaw[] = [
  {
    id: 1,
    hue: 45,
    common_name: 'Powdery Mildew',
    scientific_name: 'Erysiphales',
    host: ['Most foliage plants'],
    description:
      'A white, powdery fungal coating on leaves and stems, thriving in warm, humid air with poor circulation.',
    solution:
      'Improve airflow, avoid wetting foliage, remove affected leaves, and treat with a potassium-bicarbonate or neem spray.',
  },
  {
    id: 2,
    hue: 25,
    common_name: 'Root Rot',
    scientific_name: 'Pythium / Phytophthora',
    host: ['Succulents', 'Overwatered plants'],
    description:
      "Roots turn brown, soft and mushy from waterlogged soil, cutting off the plant's ability to drink and breathe.",
    solution:
      'Unpot, cut away black roots, repot in fresh free-draining mix, and water only when the top of the soil is dry.',
  },
  {
    id: 3,
    hue: 15,
    common_name: 'Spider Mites',
    scientific_name: 'Tetranychus urticae',
    host: ['Calathea', 'Ficus', 'Palms'],
    description:
      'Tiny sap-sucking arachnids that leave fine webbing and pale stippling on leaves in dry indoor air.',
    solution:
      'Raise humidity, shower the foliage, and treat undersides weekly with insecticidal soap or neem until clear.',
  },
  {
    id: 4,
    hue: 130,
    common_name: 'Aphids',
    scientific_name: 'Aphidoidea',
    host: ['New growth', 'Flowering plants'],
    description:
      'Clusters of soft green or black insects on tender shoots, leaving sticky honeydew and distorting new growth.',
    solution:
      'Rinse off with water, wipe stems, and apply insecticidal soap; ladybirds are natural predators outdoors.',
  },
  {
    id: 5,
    hue: 55,
    common_name: 'Mealybugs',
    scientific_name: 'Pseudococcidae',
    host: ['Succulents', 'Aroids'],
    description:
      'Fuzzy white cottony masses tucked in leaf joints, draining sap and weakening the plant over time.',
    solution:
      'Dab each insect with a cotton swab dipped in 70% isopropyl alcohol, then follow up with neem oil.',
  },
  {
    id: 6,
    hue: 35,
    common_name: 'Leaf Spot',
    scientific_name: 'Various fungi & bacteria',
    host: ['Most houseplants'],
    description:
      'Brown or black spots ringed with yellow, spreading where foliage stays wet and air is stagnant.',
    solution:
      'Remove affected leaves, water at the soil line, improve ventilation, and apply a copper-based fungicide if needed.',
  },
  {
    id: 7,
    hue: 60,
    common_name: 'Scale Insects',
    scientific_name: 'Coccoidea',
    host: ['Ficus', 'Ferns', 'Palms'],
    description:
      'Small brown limpet-like bumps fixed to stems and leaf veins, sapping vigour and dropping honeydew.',
    solution:
      'Scrape off gently, prune heavily infested stems, and treat with horticultural oil to smother remaining insects.',
  },
  {
    id: 8,
    hue: 40,
    common_name: 'Fungus Gnats',
    scientific_name: 'Sciaridae',
    host: ['Moist potting soil'],
    description:
      'Small black flies hovering over the soil; their larvae feed on roots in consistently damp mixes.',
    solution:
      'Let the top of the soil dry fully between waterings, use yellow sticky traps, and a BTI soil drench for larvae.',
  },
]
