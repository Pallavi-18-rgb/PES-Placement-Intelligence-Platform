import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getCompaniesData = async () => {
  const { data, error } = await supabase.from('consolidation').select('*');
  if (error) {
    const jsonPath = path.resolve(__dirname, '../../src/data/consolidation.json');
    try {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      return JSON.parse(raw);
    } catch(err) {
      console.error("Fallback failed:", err);
      return [];
    }
  }
  return data;
};

const deriveHiringStatus = (velocity = '') => {
  const v = velocity.trim().toLowerCase();
  if (v === 'moderate' || v === 'medium') return 'Scheduled';
  if (v === 'low' || v === 'stagnant') return 'Closed';
  return 'Actively Hiring';
};

const generateNotification = (company, index) => {
  const hiringStatus = deriveHiringStatus(company.hiring_velocity);
  const companyName = company.short_name || company.name;
  const hash = (company.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const activeMessages = [
    { message: `Registration open for ${companyName} — Submit your profile before the deadline closes`, badge: 'Deadline Approaching' },
    { message: `${companyName} hiring for SDE roles — Apply now through the placement portal`, badge: 'Registration Open' },
    { message: `${companyName} registration closing in 48 hours — Don't miss this opportunity`, badge: 'Deadline Approaching' },
  ];

  const scheduledMessages = [
    { message: `Technical Interview with ${companyName} scheduled — Prepare DSA & System Design`, badge: 'Interview Tomorrow' },
    { message: `${companyName} Aptitude Test announced — Quantitative, Logical & Coding sections`, badge: 'Interview Tomorrow' },
    { message: `HR Round with ${companyName} begins next week — Prepare behavioral answers`, badge: 'Interview Tomorrow' },
  ];

  const closedMessages = [
    { message: `${companyName} results announced — Offer letters dispatched to selected candidates`, badge: 'Results Published' },
    { message: `${companyName} hiring cycle completed — Check placement portal for final results`, badge: 'Results Published' },
    { message: `${companyName} shortlist released — Selected candidates notified via email`, badge: 'Results Published' },
  ];

  const otherMessages = [
    { message: `${companyName} added new job roles — Multiple openings across departments`, badge: 'Hiring Open' },
    { message: `${companyName} updated CTC structure — Revised package details available`, badge: 'New Update' },
    { message: `${companyName} campus drive confirmed — Pre-placement talk scheduled`, badge: 'Hiring Open' },
  ];

  let pool;
  if (hiringStatus === 'Actively Hiring') pool = activeMessages;
  else if (hiringStatus === 'Scheduled') pool = scheduledMessages;
  else pool = [...closedMessages, ...otherMessages];

  const picked = pool[(hash + index) % pool.length];
  return { ...picked, hiringStatus };
};

export const getNotifications = async (req, res, next) => {
  try {
    const companies = await getCompaniesData();
    
    const scored = companies.map(c => {
      const status = deriveHiringStatus(c.hiring_velocity);
      const priority = status === 'Actively Hiring' ? 0 : status === 'Scheduled' ? 1 : 2;
      return { ...c, _status: status, _priority: priority };
    });
    scored.sort((a, b) => a._priority - b._priority);
    const top = scored.slice(0, 15);

    const notifications = top.map((company, i) => {
      const { message, badge, hiringStatus } = generateNotification(company, i);
      return {
        id: company.company_id || company.Column1 || String(i + 1),
        company: company.name,
        short_name: company.short_name,
        company_id: company.company_id || company.Column1 || String(i + 1),
        status: hiringStatus,
        badge,
        message,
        logo: company.logo_url || '',
        website: company.website_url || '',
      };
    });

    res.json({ success: true, source: 'database', data: notifications });
  } catch (error) {
    next(error);
  }
};
