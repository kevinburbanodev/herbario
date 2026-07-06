import type { PlantDetail } from './plant.entity'
import type { Lang } from '@/shared/i18n/translations'

export interface CareGuideSection {
  type: 'watering' | 'sunlight' | 'soil' | 'pruning'
  title: string
  text: string
}

/** Composes a plausible, generic care guide from a plant's own attributes.
 * Used as a fallback when Perenual's species-care-guide-list endpoint has no
 * entry for a given species (most of the catalog doesn't). */
export function composeCareGuide(plant: PlantDetail, lang: Lang, titles: Record<CareGuideSection['type'], string>): CareGuideSection[] {
  const sun = plant.sunlight.join(', ') || (lang === 'es' ? 'luz brillante e indirecta' : 'bright, indirect light')
  const bench = plant.wateringBenchmark
    ? lang === 'es'
      ? `cada ${plant.wateringBenchmark}, aproximadamente`
      : `roughly every ${plant.wateringBenchmark}`
    : lang === 'es'
      ? 'cuando la parte superior del sustrato esté seca'
      : 'when the top soil dries'
  const soil = (plant.soil.length ? plant.soil : [lang === 'es' ? 'un sustrato bien drenado' : 'a well-drained mix'])
    .join(', ')
    .toLowerCase()
  const wateringLevel = (plant.watering || (lang === 'es' ? 'medio' : 'average')).toLowerCase()
  const hasFullSun = plant.sunlight.some((s) => s.toLowerCase().includes('full sun'))

  const watering =
    lang === 'es'
      ? `${plant.commonName} prefiere un riego ${wateringLevel} — riega ${bench}, dejando que el exceso drene libremente. ` +
        (plant.droughtTolerant
          ? 'Almacena agua en sus tejidos, así que es preferible quedarse corto que pasarse: el exceso de riego es la forma más rápida de matarla.'
          : 'Mantén el sustrato uniformemente húmedo pero nunca encharcado, y vacía el plato para que las raíces no queden en agua.')
      : `${plant.commonName} prefers ${wateringLevel} watering — water ${bench}, letting excess drain freely. ` +
        (plant.droughtTolerant
          ? 'It stores water in its tissue, so err on the side of underwatering; soggy roots are the fastest way to kill it.'
          : "Keep the soil evenly moist but never waterlogged, and empty the saucer so the roots don't sit in water.")

  const sunlight =
    lang === 'es'
      ? `Dale ${sun}. ` +
        (hasFullSun
          ? 'Puede tolerar sol directo por la mañana, pero protégela del sol fuerte del mediodía que quema las hojas.'
          : 'Evita el sol directo del mediodía, que decolora y quema el follaje; una ventana orientada al este o norte es ideal.')
      : `Give it ${sun}. ` +
        (hasFullSun
          ? 'It can take direct morning sun, but shield it from harsh midday rays that scorch the leaves.'
          : 'Avoid direct midday sun, which bleaches and burns the foliage; an east or north window is ideal.')

  const soilText =
    lang === 'es'
      ? `Plántala en ${soil}. Abónala con un fertilizante líquido equilibrado una vez al mes en primavera y verano, y detén el abonado en invierno mientras el crecimiento se ralentiza.`
      : `Plant in ${soil}. Feed with a balanced liquid fertiliser monthly through spring and summer, and pause in winter while growth slows.`

  const pruningMonths = (plant.pruningMonths.length ? plant.pruningMonths : [lang === 'es' ? 'primavera' : 'spring'])
    .join(', ')
    .toLowerCase()
  const maintenance = (plant.maintenance || (lang === 'es' ? 'bajo' : 'low')).toLowerCase()
  const careLevel = (plant.careLevel || (lang === 'es' ? 'fácil' : 'easy')).toLowerCase()
  const pruning =
    lang === 'es'
      ? `Poda en ${pruningMonths} para mantener la forma y eliminar el crecimiento cansado. El mantenimiento es ${maintenance} y el nivel de cuidado general es ${careLevel}.`
      : `Prune in ${pruningMonths} to keep the shape tidy and remove any tired growth. Maintenance is ${maintenance} and the overall care level is ${careLevel}.`

  return [
    { type: 'watering', title: titles.watering, text: watering },
    { type: 'sunlight', title: titles.sunlight, text: sunlight },
    { type: 'soil', title: titles.soil, text: soilText },
    { type: 'pruning', title: titles.pruning, text: pruning },
  ]
}
