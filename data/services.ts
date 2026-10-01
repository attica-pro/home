import {
  DemolitionIcon,
  InsulationIcon,
  PaintingIcon,
  PavingIcon,
  RenovationsIcon,
  RepairsIcon,
  WoodIcon,
  type ServiceIcon,
} from '@/components/icons/ServiceIcons';

/**
 * The services offered, in display order. Each slug is a route under
 * /[locale]/services/ and a key under `services.items` in the message files.
 */
export const serviceSlugs = ['insulation', 'painting', 'renovations', 'demolition', 'paving', 'wood', 'repairs'] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export const serviceIcons: Record<ServiceSlug, ServiceIcon> = {
  insulation: InsulationIcon,
  painting: PaintingIcon,
  renovations: RenovationsIcon,
  demolition: DemolitionIcon,
  paving: PavingIcon,
  wood: WoodIcon,
  repairs: RepairsIcon,
};

/** Ink drawing of the service, made by scripts/prepare-illustrations.py (600x800, transparent). */
export function serviceIllustration(slug: ServiceSlug) {
  return `/images/illustrations/${slug}.png`;
}

export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}
