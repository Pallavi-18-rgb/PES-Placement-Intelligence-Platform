import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getCompanyData = async (companyId) => {
  const { data, error } = await supabase.from('consolidation').select('*').eq('id', companyId).single();
  if (error) {
    const jsonPath = path.resolve(__dirname, '../../src/data/consolidation.json');
    try {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      const companies = JSON.parse(raw);
      return companies.find(c => String(c.Column1) === String(companyId) || String(c.company_id) === String(companyId) || String(c.id) === String(companyId));
    } catch(err) {
      console.error("Fallback failed:", err);
      return null;
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

const generateDates = (companyId) => {
  const id = Number(companyId) || 1;
  const baseMonth = 7 + (id % 6);
  const year = baseMonth > 11 ? 2027 : 2026;
  const month = baseMonth > 11 ? baseMonth - 12 : baseMonth;
  const dayOffset = ((id * 7) % 20) + 3;
  const startDay = Math.min(dayOffset, 28);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  
  const regDate = new Date(year, month, startDay);
  const aptDate = new Date(regDate); aptDate.setDate(aptDate.getDate() + 7);
  const techDate = new Date(aptDate); techDate.setDate(techDate.getDate() + 8);
  const hrDate = new Date(techDate); hrDate.setDate(hrDate.getDate() + 7);
  const resultDate = new Date(hrDate); resultDate.setDate(resultDate.getDate() + 10);
  
  const fmt = (d) => `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}, ${d.getFullYear()}`;
  
  return {
    registration: fmt(regDate),
    aptitude: fmt(aptDate),
    technical: fmt(techDate),
    hr: fmt(hrDate),
    results: fmt(resultDate),
  };
};

export const getTimelines = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const company = await getCompanyData(companyId);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const hiringStatus = deriveHiringStatus(company.hiring_velocity);
    const isActivelyHiring = hiringStatus === 'Actively Hiring';
    const isScheduled = hiringStatus === 'Scheduled';
    const dates = generateDates(company.company_id || company.Column1 || companyId);

    const timeline = [
      { step: 'Registration', date: dates.registration, status: isActivelyHiring ? 'in-progress' : 'completed', actionUrl: company.website_url || '' },
      { step: 'Aptitude Test', date: dates.aptitude, status: isActivelyHiring ? 'upcoming' : isScheduled ? 'in-progress' : 'completed' },
      { step: 'Technical Interview', date: dates.technical, status: isActivelyHiring ? 'upcoming' : isScheduled ? 'upcoming' : 'completed' },
      { step: 'HR Interview', date: dates.hr, status: isActivelyHiring ? 'upcoming' : isScheduled ? 'upcoming' : 'completed' },
      { step: 'Results', date: dates.results, status: isActivelyHiring ? 'upcoming' : isScheduled ? 'upcoming' : 'completed' }
    ];

    res.json({ success: true, company: company.name, hiringStatus, dates, timeline });
  } catch (error) {
    next(error);
  }
};
