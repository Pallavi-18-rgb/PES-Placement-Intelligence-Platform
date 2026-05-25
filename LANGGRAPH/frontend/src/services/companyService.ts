import { Company, CompanyFilters, SortField, SortDirection } from '@/types/company';

async function fetchLocalSummary(): Promise<any[]> {
  try {
    const response = await fetch('/data/summary.json');
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching local summary:', error);
    return [];
  }
}

function normalizeCompanyKey(item: any): string {
  const name = String(item.name || '').trim().toLowerCase();
  const shortName = String(item.short_name || '').trim().toLowerCase();
  const id = String(item.id || '').trim().toLowerCase();
  return name || shortName || id;
}

function getLogoUrl(item: any): string {
  const raw = item.logo_url || item.logo || item.website_url || item.website || '';
  const rawUrl = String(raw || '').trim();
  if (rawUrl) {
    // support multiple candidate URLs separated by commas or semicolons
    const parts = rawUrl.split(/[;,]+/).map((s) => s.trim()).filter(Boolean);
    for (const p of parts) {
      if (/^https?:\/\//i.test(p)) return p;
      // if it's a domain-like string, assume https
      if (/^[\w.-]+\.[a-z]{2,}$/i.test(p)) return `https://${p}`;
    }
    // fallback to original raw string if nothing matched
    return rawUrl;
  }
  // No explicit logo found — use local placeholder.
  return '/assets/logo-placeholder.svg';
}

function mergeCompanyData(base: any, overrides: any): any {
  const merged = { ...base };
  if (!overrides || typeof overrides !== 'object') return merged;

  Object.entries(overrides).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      merged[key] = value;
    }
  });

  return merged;
}

function buildCompany(item: any): Company {
  return {
    ...item,
    name: String(item.name || item.short_name || 'Unknown Company'),
    short_name: String(item.short_name || item.name || ''),
    logo_url: getLogoUrl(item),
    category: String(item.category || 'Unknown'),
    hiring_velocity: String(item.hiring_velocity || 'Moderate'),
    profitability_status: String(item.profitability_status || 'Profitable'),
    remote_policy_details: String(item.remote_policy_details || 'Hybrid'),
    website_url: String(item.website_url || ''),
    // Common fields with safe defaults to avoid blanks in the UI
    employee_size: String(item.employee_size || item.size || '—'),
    overview_text: String(item.overview_text || item.summary || ''),
    headquarter_address: String(item.headquarters_address || item.headquarters || ''),
    office_count: item.office_count ?? item.offices ?? null,
    office_locations: String(item.office_locations || ''),
    recent_news: String(item.recent_news || ''),
  } as Company;
}

function dedupeCompanies(companies: any[]): any[] {
  const seen = new Set<string>();
  return companies.filter((company) => {
    const key = normalizeCompanyKey(company);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function applyLocalFilters(data: any[], filters?: CompanyFilters): any[] {
  if (!filters) return data;

  return data.filter((item) => {
    const matchesCategory = filters.category ? item.category === filters.category : true;
    const matchesEmployeeSize = filters.employee_size ? item.employee_size === filters.employee_size : true;
    const matchesProfitability = filters.profitability_status ? item.profitability_status === filters.profitability_status : true;
    const matchesHiringVelocity = filters.hiring_velocity ? item.hiring_velocity === filters.hiring_velocity : true;
    const matchesFocusSectors = filters.focus_sectors
      ? String(item.focus_sectors || '').toLowerCase().includes(filters.focus_sectors.toLowerCase())
      : true;
    const matchesSearch = filters.search
      ? [item.name, item.short_name, item.overview_text, item.focus_sectors]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(filters.search!.toLowerCase()))
      : true;

    return matchesCategory && matchesEmployeeSize && matchesProfitability && matchesHiringVelocity && matchesFocusSectors && matchesSearch;
  });
}

function sortLocalCompanies(data: any[], sort?: { field: SortField; direction: SortDirection }): any[] {
  const field = sort?.field || 'name';
  const direction = sort?.direction === 'desc' ? -1 : 1;

  return [...data].sort((a, b) => {
    const aVal = String(a[field] ?? '').toLowerCase();
    const bVal = String(b[field] ?? '').toLowerCase();
    return aVal.localeCompare(bVal) * direction;
  });
}

export async function fetchCompanies(
  filters?: CompanyFilters,
  sort?: { field: SortField; direction: SortDirection },
  limit?: number,
  offset?: number
): Promise<{ data: Company[]; count: number }> {
  const localData = await fetchLocalSummary();
  const dedupedLocal = dedupeCompanies(localData);
  const filtered = applyLocalFilters(dedupedLocal, filters);
  const sorted = sortLocalCompanies(filtered, sort);
  const paged = limit !== undefined ? sorted.slice(offset ?? 0, (offset ?? 0) + limit) : sorted;

  return { data: paged.map(buildCompany), count: sorted.length };
}

async function fetchFullData(path: string): Promise<any> {
  try {
    const response = await fetch(path);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching full data:', error);
    return null;
  }
}

export async function fetchCompanyById(id: string): Promise<Company | null> {
  const localSummary = await fetchLocalSummary();

  const localMatch = localSummary.find(
    (item) =>
      String(item.id) === id ||
      item.short_name?.toLowerCase() === id.toLowerCase() ||
      item.name?.toLowerCase() === id.toLowerCase() ||
      id.toLowerCase().includes(item.name?.toLowerCase() ?? '') ||
      item.name?.toLowerCase().includes(id.toLowerCase())
  );

  if (!localMatch) return null;

  const safeName = String(localMatch.name || localMatch.short_name || id).replace(/[^a-zA-Z0-9]/g, '_');
  const fullDataPath = localMatch.full_json || `/data/Companies_Full/${safeName}.json`;
  const fullData = await fetchFullData(fullDataPath);
  const merged = mergeCompanyData(localMatch, fullData || {});

  return buildCompany(merged);
}

export async function fetchCompanyCategories(): Promise<{ category: string; count: number }[]> {
  const localData = await fetchLocalSummary();
  const dedupedLocal = dedupeCompanies(localData);

  const stats: Record<string, number> = {};
  dedupedLocal.forEach((item: any) => {
    if (item?.category) stats[item.category] = (stats[item.category] || 0) + 1;
  });

  return Object.entries(stats).map(([category, count]) => ({ category, count }));
}

export async function fetchDistinctValues(column: keyof Company): Promise<string[]> {
  const localData = await fetchLocalSummary();
  const dedupedLocal = dedupeCompanies(localData);

  const values = new Set<string>();
  dedupedLocal.forEach((item: any) => {
    const value = item?.[column];
    if (value) values.add(String(value));
  });

  return Array.from(values).filter(Boolean) as string[];
}

export async function fetchCompanyStats(): Promise<{
  total: number;
  byCategory: Record<string, number>;
  byHiringVelocity: Record<string, number>;
  byProfitability: Record<string, number>;
  byRemotePolicy: Record<string, number>;
}> {
  const localData = await fetchLocalSummary();
  const merged = dedupeCompanies(localData);
  const stats = {
    total: merged.length,
    byCategory: {} as Record<string, number>,
    byHiringVelocity: {} as Record<string, number>,
    byProfitability: {} as Record<string, number>,
    byRemotePolicy: {} as Record<string, number>,
  };

  merged.forEach((item: any) => {
    if (item.category) stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
    if (item.hiring_velocity) stats.byHiringVelocity[item.hiring_velocity] = (stats.byHiringVelocity[item.hiring_velocity] || 0) + 1;
    if (item.profitability_status) stats.byProfitability[item.profitability_status] = (stats.byProfitability[item.profitability_status] || 0) + 1;
    if (item.remote_policy_details) stats.byRemotePolicy[item.remote_policy_details] = (stats.byRemotePolicy[item.remote_policy_details] || 0) + 1;
  });

  return stats;
}
