import fs from 'node:fs';
import path from 'node:path';

export interface OpportunityItem {
  area_slug: string;
  area_name_el: string;
  is_hq: boolean;
  service: string;
  trade_name_el: string;
  opportunity_score: number;
  category: string;
  action_recommendation: string;
  search_demand_count: number;
  top_search_queries: string[];
  building_age_index: number;
  guerrilla_target_hubs: string[];
}

export interface OpportunityMatrix {
  generated_at: string;
  total_opportunities: number;
  weather_snapshot: {
    total_rain_10d_mm: number;
    rainy_days_count: number;
    avg_max_temp: number;
    multipliers: Record<string, number>;
  };
  top_digital_goldmines: OpportunityItem[];
  top_guerrilla_goldmines: OpportunityItem[];
  full_matrix: OpportunityItem[];
}

let cachedMatrix: OpportunityMatrix | null = null;

export function getOpportunityMatrix(): OpportunityMatrix | null {
  if (cachedMatrix) return cachedMatrix;
  const filePath = path.join(process.cwd(), 'content', 'opportunity_matrix.json');
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedMatrix = JSON.parse(raw) as OpportunityMatrix;
    return cachedMatrix;
  } catch {
    return null;
  }
}

export function getOpportunityFor(areaSlug: string, serviceSlug: string): OpportunityItem | null {
  const matrix = getOpportunityMatrix();
  if (!matrix) return null;

  // Exact match or fallback for composite area slugs
  const exact = matrix.full_matrix.find((item) => item.area_slug === areaSlug && item.service === serviceSlug);
  if (exact) return exact;

  // If areaSlug is composite like 'koukaki-neos-kosmos', match partial
  const partial = matrix.full_matrix.find(
    (item) => (areaSlug.includes(item.area_slug) || item.area_slug.includes(areaSlug)) && item.service === serviceSlug,
  );
  return partial ?? null;
}

export function getTopQueriesFor(areaSlug: string, serviceSlug: string): string[] {
  const opp = getOpportunityFor(areaSlug, serviceSlug);
  return opp ? opp.top_search_queries : [];
}

export function getAreaGuerrillaHubs(areaSlug: string): string[] {
  const matrix = getOpportunityMatrix();
  if (!matrix) return [];
  const entry = matrix.full_matrix.find(
    (item) => item.area_slug === areaSlug || areaSlug.includes(item.area_slug) || item.area_slug.includes(areaSlug),
  );
  return entry ? entry.guerrilla_target_hubs : [];
}
