import { Company, CompanyFilters, SortField, SortDirection } from '@/types/company';
import { supabase } from '@/lib/supabase';

/**
 * Company data service abstraction.
 * Currently returns empty arrays — will be wired to Supabase later.
 * All components consume this service, never direct DB calls.
 */

// Simulates async fetch — replace internals with Supabase client later
async function fetchLocalSummary(): Promise<any[]> {
  try {
    const response = await fetch('/data/summary.json');
    if (!response.ok) return [];
    return await response.json();
  } catch (e) {
    console.error('Error fetching local summary:', e);
    return [];
  }
}

function mergeData(supabaseData: any[], localData: any[]): any[] {
  return supabaseData.map(item => {
    const itemName = String(item.name || '').toLowerCase();
    const itemShort = String(item.short_name || '').toLowerCase();
    
    const local = localData.find(l => {
      const lName = String(l.name || '').toLowerCase();
      const lShort = String(l.short_name || '').toLowerCase();
      return itemName.includes(lName) || 
             lName.includes(itemName) ||
             itemName.includes(lShort) || 
             lName.includes(itemShort);
    });

    return {
      ...item,
      hiring_velocity: item.hiring_velocity || local?.hiring_velocity || 'Moderate',
      profitability_status: item.profitability_status || local?.profitability_status || 'Profitable',
      remote_policy_details: item.remote_policy_details || local?.remote_policy_details || 'Hybrid',
      logo_url: item.logo_url || local?.logo_url || `https://logo.clearbit.com/${item.name?.split(' ')[0].toLowerCase()}.com` || '/placeholder.svg',
      full_json: local?.full_json,
      hiring_json: local?.hiring_json,
      innovx_json: local?.innovx_json
    };
  });
}

export async function fetchCompanies(
  filters?: CompanyFilters,
  sort?: { field: SortField; direction: SortDirection },
  limit?: number,
  offset?: number
): Promise<{ data: Company[]; count: number }> {
  let query = supabase
    .from('companies')
    .select('*', { count: 'exact' });

  if (filters) {
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.focus_sectors) query = query.ilike('focus_sectors', `%${filters.focus_sectors}%`);
    if (filters.employee_size) query = query.eq('employee_size', filters.employee_size);
    if (filters.profitability_status) query = query.eq('profitability_status', filters.profitability_status);
    if (filters.hiring_velocity) query = query.eq('hiring_velocity', filters.hiring_velocity);
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,short_name.ilike.%${filters.search}%,overview_text.ilike.%${filters.search}%`);
    }
  }

  if (sort) {
    query = query.order(sort.field, { ascending: sort.direction === 'asc' });
  } else {
    query = query.order('name', { ascending: true });
  }

  if (limit !== undefined) {
    const from = offset ?? 0;
    const to = from + limit - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;
  const localData = await fetchLocalSummary();

  if (error || !data || data.length === 0) {
    console.warn('Supabase empty or failed, falling back to local summary');
    return { data: localData as Company[], count: localData.length };
  }

  const merged = mergeData(data || [], localData);
  return { data: (merged as Company[]) || [], count: count || 0 };
}

async function fetchFullData(path: string): Promise<any> {
  try {
    const response = await fetch(path);
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error('Error fetching full data:', e);
    return null;
  }
}

export async function fetchCompanyById(id: string): Promise<Company | null> {
  const localSummary = await fetchLocalSummary();
  
  // 1. Try to find in local data first if id looks like a local ID or name
  const localMatch = localSummary.find(l => 
    String(l.id) === id || 
    l.short_name?.toLowerCase() === id.toLowerCase() ||
    l.name?.toLowerCase() === id.toLowerCase() ||
    id.toLowerCase().includes(l.name?.toLowerCase()) ||
    l.name?.toLowerCase().includes(id.toLowerCase())
  );

  let supabaseData = null;
  
  // 2. Try Supabase by UUID if possible
  if (id.length > 10) { // Simple UUID check
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (!error && data) supabaseData = data;
  }

  // 3. Fallback Supabase lookup by name if we have a local match but no supabase data yet
  if (!supabaseData && localMatch) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('name', `%${localMatch.name.split(' ')[0]}%`)
      .maybeSingle();
    if (!error && data) supabaseData = data;
  }

  if (!supabaseData && !localMatch) return null;

  const summaryMerged = mergeData([supabaseData || { name: localMatch?.name }], localSummary)[0];
  
  // Use the path from the summary
  const safeName = summaryMerged.name.replace(/[^a-zA-Z0-9]/g, '_');
  const fullDataPath = summaryMerged.full_json || `/data/Companies_Full/${safeName}.json`;
  const fullData = await fetchFullData(fullDataPath);
  
  const merged = { ...summaryMerged, ...(fullData || {}) };

  return (merged as Company) || null;
}

export async function fetchCompanyCategories(): Promise<{ category: string; count: number }[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('category');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const counts: Record<string, number> = {};
  data.forEach((item: { category: string }) => {
    if (item.category) counts[item.category] = (counts[item.category] || 0) + 1;
  });

  return Object.entries(counts).map(([category, count]) => ({ category, count }));
}

export async function fetchDistinctValues(column: keyof Company): Promise<string[]> {
  const { data, error } = await supabase
    .from('companies')
    .select(column as string);

  if (error) {
    console.error(`Error fetching distinct values for ${column}:`, error);
    return [];
  }

  const values = new Set(data.map((item: any) => item[column]));
  return Array.from(values).filter(Boolean) as string[];
}

export async function fetchCompanyStats(): Promise<{
  total: number;
  byCategory: Record<string, number>;
  byHiringVelocity: Record<string, number>;
  byProfitability: Record<string, number>;
  byRemotePolicy: Record<string, number>;
}> {
  const { data, error } = await supabase
    .from('companies')
    .select('*');

  if (error) {
    console.error('Error fetching company stats:', error);
    return {
      total: 0,
      byCategory: {},
      byHiringVelocity: {},
      byProfitability: {},
      byRemotePolicy: {},
    };
  }

  const localData = await fetchLocalSummary();
  const merged = mergeData(data || [], localData);

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
