import { Company, CompanyFilters, SortField, SortDirection } from '@/types/company';
import { toast } from 'sonner';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ─────────────────────────────────────────────────
// fetchCompanies  →  GET /api/companies
// ─────────────────────────────────────────────────
export async function fetchCompanies(
  filters?: CompanyFilters,
  sort?: { field: SortField; direction: SortDirection },
  limit?: number,
  offset?: number
): Promise<{ data: Company[]; count: number }> {
  const params = new URLSearchParams();

  if (filters?.search)   params.set('search',    filters.search);
  if (filters?.category) params.set('category',  filters.category);
  if (sort?.field)       params.set('sort',      sort.field);
  if (sort?.direction)   params.set('direction', sort.direction);
  if (limit  != null)    params.set('limit',     String(limit));
  if (offset != null)    params.set('offset',    String(offset));

  try {
    const res  = await fetch(`${API_BASE}/companies?${params.toString()}`, { headers: getHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success) return { data: json.data, count: json.count };
  } catch (err: any) {
    console.error('[companyService] fetchCompanies failed, using empty list', err);
    toast.error(`fetchCompanies Error: ${err.message}`);
  }

  return { data: [], count: 0 };
}

// ─────────────────────────────────────────────────
// fetchCompanyById  →  GET /api/companies/:id
// ─────────────────────────────────────────────────
export async function fetchCompanyById(id: string): Promise<Company | null> {
  try {
    const res  = await fetch(`${API_BASE}/companies/${encodeURIComponent(id)}`, { headers: getHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) return json.data as Company;
  } catch (err) {
    console.error('[companyService] fetchCompanyById failed:', err);
  }
  return null;
}

// ─────────────────────────────────────────────────
// fetchCompanyCategories  →  derived from /api/companies/stats
// ─────────────────────────────────────────────────
export async function fetchCompanyCategories(): Promise<{ category: string; count: number }[]> {
  try {
    const res  = await fetch(`${API_BASE}/companies/stats`, { headers: getHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.stats?.byCategory) {
      return Object.entries(json.stats.byCategory).map(([category, count]) => ({
        category,
        count: count as number,
      })).sort((a, b) => a.category.localeCompare(b.category));
    }
  } catch (err) {
    console.error('[companyService] fetchCompanyCategories failed:', err);
  }
  return [];
}

// ─────────────────────────────────────────────────
// fetchDistinctValues  →  derived from full list
// ─────────────────────────────────────────────────
export async function fetchDistinctValues(column: keyof Company): Promise<string[]> {
  const { data } = await fetchCompanies();
  const vals = data.map(c => c[column]).filter((v): v is string => typeof v === 'string' && !!v);
  return [...new Set(vals)].sort();
}

// ─────────────────────────────────────────────────
// fetchCompanyStats  →  GET /api/companies/stats
// ─────────────────────────────────────────────────
export async function fetchCompanyStats(): Promise<{
  total: number;
  byCategory: Record<string, number>;
  byHiringVelocity: Record<string, number>;
  byProfitability: Record<string, number>;
  byRemotePolicy: Record<string, number>;
}> {
  try {
    const res = await fetch(`${API_BASE}/companies/stats`, { headers: getHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.stats) return json.stats;
  } catch (err: any) {
    console.error('[companyService] fetchCompanyStats failed, using fallback data:', err);
    toast.error(`fetchCompanyStats Error: ${err.message}`);
  }
  // Fallback: load local JSON data
  try {
    const fallback = await import('../data/consolidation.json');
    const companies = fallback.default as any[];
    const total = companies.length;
    const byCategory: Record<string, number> = {};
    const byHiringVelocity: Record<string, number> = {};
    const byProfitability: Record<string, number> = {};
    const byRemotePolicy: Record<string, number> = {};
    for (const c of companies) {
      const cat = c.category || 'Unknown';
      byCategory[cat] = (byCategory[cat] ?? 0) + 1;
      const hv = c.hiringVelocity || 'Unknown';
      byHiringVelocity[hv] = (byHiringVelocity[hv] ?? 0) + 1;
      const prof = c.profitability || 'Unknown';
      byProfitability[prof] = (byProfitability[prof] ?? 0) + 1;
      const rp = c.remotePolicy || 'Unknown';
      byRemotePolicy[rp] = (byRemotePolicy[rp] ?? 0) + 1;
    }
    return { total, byCategory, byHiringVelocity, byProfitability, byRemotePolicy };
  } catch (fallbackErr) {
    console.error('[companyService] fallback stats load failed:', fallbackErr);
    return { total: 0, byCategory: {}, byHiringVelocity: {}, byProfitability: {}, byRemotePolicy: {} };
  }
}
