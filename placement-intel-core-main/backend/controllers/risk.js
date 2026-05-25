import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';

const getCompanyData = async (companyId) => {
  const { data, error } = await supabase.from('consolidation').select('name, category, eligibility_criteria').eq('id', companyId).single();
  
  if (error) {
    const jsonPath = path.resolve('../src/data/consolidation.json');
    try {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      const companies = JSON.parse(raw);
      return companies.find(c => String(c.id) === String(companyId) || String(c.company_id) === String(companyId));
    } catch(err) {
      console.error("Fallback failed:", err);
      return null;
    }
  }
  return data;
};

export const getRiskAnalysis = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const company = await getCompanyData(companyId);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    let riskScore = 50; 
    let riskLevel = 'Medium';
    const reasons = [];

    if (company.category === 'Tech Giants') {
      riskScore = 85;
      riskLevel = 'High';
      reasons.push('Highly competitive applicant pool');
      reasons.push('Stringent technical rounds (Graph/DP algorithms expected)');
    } else if (company.category === 'Product Companies') {
      riskScore = 65;
      riskLevel = 'Medium-High';
      reasons.push('Strong focus on low-level design');
      reasons.push('Requires good OOPs knowledge');
    } else {
      riskScore = 30;
      riskLevel = 'Low';
      reasons.push('Mass hiring event');
      reasons.push('Focuses more on cognitive/aptitude tests');
    }

    res.json({
      success: true,
      company: company.name,
      analysis: {
        score: riskScore,
        level: riskLevel,
        key_factors: reasons
      }
    });

  } catch (error) {
    next(error);
  }
};
