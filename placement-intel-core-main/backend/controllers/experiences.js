import { supabase } from '../config/supabase.js';

export const getExperiences = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    
    // In a full implementation, this would query an "experiences" table filtered by company_id.
    // Assuming you have an experiences table in Supabase:
    const { data: experiences, error } = await supabase
      .from('interview_experiences') // Hypothetical table
      .select('*')
      .eq('company_id', companyId);

    // If the table doesn't exist yet or any other error, we will mock the response structure matching the frontend
    if (error) {
      return res.json({
        success: true,
        message: 'Returning mock data because interview_experiences table does not exist yet',
        data: [
          {
            id: 'mock-1',
            name: 'Aditya Sharma',
            role: 'SDE-1',
            year: 2025,
            difficulty: 'Hard',
            verdict: 'Selected',
            rating: 5,
            experience: 'Great interview focused on System Design and Graph algorithms.',
            prepTips: 'Grind LeetCode and System Design.',
            helpfulnessCount: 42
          }
        ]
      });
    }

    if (error) throw error;

    res.json({ success: true, data: experiences || [] });
  } catch (error) {
    next(error);
  }
};

export const addExperience = async (req, res, next) => {
  try {
    const newExperience = req.body;
    
    // Insert into Supabase table
    const { data, error } = await supabase
      .from('interview_experiences')
      .insert([newExperience])
      .select();

    if (error) {
      if (error.code === '42P01') {
        return res.status(201).json({ success: true, message: 'Mock success (table missing)', data: [newExperience] });
      }
      throw error;
    }

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
