import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load JSON fallback ──
const loadJsonFallback = () => {
  const jsonPath = path.resolve(__dirname, '../../src/data/consolidation.json');
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('JSON fallback failed:', err);
    return [];
  }
};

const saveJsonFallback = (data) => {
  const jsonPath = path.resolve(__dirname, '../../src/data/consolidation.json');
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('JSON save failed:', err);
    return false;
  }
};

// ── Fetch all companies from Supabase or fallback to JSON ──
const getAllCompanies = async () => {
  try {
    const { data, error } = await supabase.from('consolidation').select('*');
    if (error) throw error;
    if (!data || data.length === 0) {
      console.warn('Supabase returned empty data, using local JSON fallback');
      return loadJsonFallback();
    }
    return data;
  } catch (err) {
    console.warn('Supabase unavailable, using local JSON fallback:', err.message);
    return loadJsonFallback();
  }
};

// ── Normalize logo URL ──
const normalizeLogoUrl = (company) => {
  const rawLogo = (company.logo_url || company.logo || '').toString().trim();
  if (rawLogo && rawLogo.startsWith('http')) return rawLogo;
  const website = (company.website_url || company.website || '').toString().trim();
  if (website) {
    try {
      const hostname = new URL(website.startsWith('http') ? website : `https://${website}`).hostname;
      if (hostname) return `https://logo.clearbit.com/${hostname}`;
    } catch { /* ignore */ }
  }
  const nameSlug = (company.name || '').toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9]/g, '');
  return nameSlug ? `https://logo.clearbit.com/${nameSlug}.com` : '/placeholder.svg';
};

// ── Category normalizer ──
const normalizeCategory = (raw = '') => {
  const cat = raw.trim().toLowerCase();
  if (cat.includes('giant') || cat === 'enterprise' || cat.includes('large cap')) return 'Tech Giants';
  if (cat.includes('service') || cat.includes('it ') || cat.includes('consulting') || cat.includes('infotech')) return 'Service Companies';
  if (cat.includes('startup') || cat.includes('scale')) return 'Startups / Scale-ups';
  return 'Product Companies';
};

// ── Hiring status from velocity ──
const normalizeHiringStatus = (velocity = '') => {
  const v = velocity.trim().toLowerCase();
  if (v === 'moderate' || v === 'medium') return 'Scheduled';
  if (v === 'low' || v === 'stagnant') return 'Closed';
  return 'Actively Hiring';
};

// ── Role/Package/Eligibility by category ──
const getRoleDetails = (category) => {
  if (category === 'Tech Giants')
    return { role: 'Software Development Engineer (SDE-1)', package: '22 - 45 LPA', eligibility: 'CGPA ≥ 8.0 · CS/IS/ECE · No backlogs' };
  if (category === 'Product Companies')
    return { role: 'Member of Technical Staff (MTS)', package: '12 - 20 LPA', eligibility: 'CGPA ≥ 7.5 · CS/IS/ECE' };
  if (category === 'Startups / Scale-ups')
    return { role: 'Full Stack Developer Intern', package: '8 - 14 LPA', eligibility: 'CGPA ≥ 7.0 · Strong DSA Skills' };
  return { role: 'Associate Software Engineer', package: '4.5 - 7.5 LPA', eligibility: 'CGPA ≥ 6.0 · All Branches eligible' };
};

// ── De-duplicate and format company list ──
const formatCompanies = (rawList) => {
  const seen = new Set();
  const result = [];

  for (const c of rawList) {
    const nameKey = (c.name || '').trim().toLowerCase();
    if (!nameKey || seen.has(nameKey)) continue;
    seen.add(nameKey);

    const category = normalizeCategory(c.category);
    const hiring_status = normalizeHiringStatus(c.hiring_velocity);
    const { role, package: pkg, eligibility } = getRoleDetails(category);
    const idStr = String(c.company_id || c.id || '');

    result.push({
      ...c,
      id: idStr,
      category,
      role,
      package: pkg,
      hiring_status,
      eligibility_details: eligibility,
      logo_url: (c.logo_url && c.logo_url !== 'NA') ? c.logo_url : normalizeLogoUrl(c),
    });
  }
  return result;
};

// ────────────────────────────────────
// GET /api/companies
// ────────────────────────────────────
export const getCompanies = async (req, res, next) => {
  try {
    const { search, category, sort, direction, limit, offset } = req.query;

    let list = formatCompanies(await getAllCompanies());

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c =>
        (c.name || '').toLowerCase().includes(s) ||
        (c.category || '').toLowerCase().includes(s) ||
        (c.tech_stack || '').toLowerCase().includes(s) ||
        (c.short_name || '').toLowerCase().includes(s)
      );
    }

    // Category filter
    if (category) {
      list = list.filter(c => c.category === category);
    }

    // Sort
    if (sort) {
      const isAsc = direction !== 'desc';
      list.sort((a, b) => {
        const va = a[sort], vb = b[sort];
        if (typeof va === 'string' && typeof vb === 'string')
          return isAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        if (typeof va === 'number' && typeof vb === 'number')
          return isAsc ? va - vb : vb - va;
        return 0;
      });
    }

    const count = list.length;

    // Pagination
    const offsetNum = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || undefined;
    if (limitNum) list = list.slice(offsetNum, offsetNum + limitNum);

    res.json({ success: true, data: list, count, source: 'backend' });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────
// GET /api/companies/stats
// ────────────────────────────────────
export const getCompanyStats = async (req, res, next) => {
  try {
    const list = formatCompanies(await getAllCompanies());

    const stats = {
      total: list.length,
      byCategory: {},
      byHiringStatus: {},
      byHiringVelocity: {},
      byProfitability: {},
      byRemotePolicy: {},
    };

    list.forEach(c => {
      stats.byCategory[c.category] = (stats.byCategory[c.category] || 0) + 1;
      stats.byHiringStatus[c.hiring_status] = (stats.byHiringStatus[c.hiring_status] || 0) + 1;
      if (c.hiring_velocity) stats.byHiringVelocity[c.hiring_velocity] = (stats.byHiringVelocity[c.hiring_velocity] || 0) + 1;
      if (c.profitability_status) stats.byProfitability[c.profitability_status] = (stats.byProfitability[c.profitability_status] || 0) + 1;
      if (c.remote_policy_details) stats.byRemotePolicy[c.remote_policy_details] = (stats.byRemotePolicy[c.remote_policy_details] || 0) + 1;
    });

    res.json({ success: true, stats, source: 'backend' });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────
// GET /api/companies/:id
// ────────────────────────────────────
export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const normalizedId = id.toLowerCase().replace(/\s+/g, '-');

    const rawList = await getAllCompanies();

    const found = rawList.find(c => {
      if (isNumeric && (String(c.company_id) === id || String(c.id) === id)) return true;
      if (c.short_name === id) return true;
      const nameSlug = (c.name || '').toLowerCase().replace(/\s+/g, '-');
      const shortNameSlug = (c.short_name || '').toLowerCase().replace(/\s+/g, '-');
      return nameSlug === normalizedId || shortNameSlug === normalizedId;
    });

    if (!found) {
      return res.status(404).json({ success: false, message: `Company with id '${id}' not found` });
    }

    const [formatted] = formatCompanies([found]);
    res.json({ success: true, data: formatted, source: 'backend' });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────
// POST /api/companies
// ────────────────────────────────────
export const createCompany = async (req, res, next) => {
  try {
    const rawList = await getAllCompanies();
    const newCompany = {
      id: Date.now().toString(),
      ...req.body,
      created_at: new Date().toISOString()
    };
    rawList.push(newCompany);
    
    // Attempt to save to JSON file
    saveJsonFallback(rawList);
    
    res.status(201).json({ success: true, data: newCompany, message: 'Company created successfully' });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────
// PUT /api/companies/:id
// ────────────────────────────────────
export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rawList = await getAllCompanies();
    
    const index = rawList.findIndex(c => String(c.id) === String(id) || String(c.company_id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Company with id '${id}' not found` });
    }
    
    const updatedCompany = { ...rawList[index], ...req.body, updated_at: new Date().toISOString() };
    rawList[index] = updatedCompany;
    
    saveJsonFallback(rawList);
    
    res.json({ success: true, data: updatedCompany, message: 'Company updated successfully' });
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────
// DELETE /api/companies/:id
// ────────────────────────────────────
export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rawList = await getAllCompanies();
    
    const index = rawList.findIndex(c => String(c.id) === String(id) || String(c.company_id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Company with id '${id}' not found` });
    }
    
    const deleted = rawList.splice(index, 1)[0];
    saveJsonFallback(rawList);
    
    res.json({ success: true, data: deleted, message: 'Company deleted successfully' });
  } catch (error) {
    next(error);
  }
};
