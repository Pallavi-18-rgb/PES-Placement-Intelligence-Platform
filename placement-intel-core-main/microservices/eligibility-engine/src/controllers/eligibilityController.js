const { evaluateEligibility } = require('../engine/rules');
const axios = require('axios');

// In a real microservice, we would fetch this via HTTP from User/Company services
// URL would be configured via ENV variables (e.g. USER_SERVICE_URL)
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';

const fetchStudentData = async (studentId) => {
  // Mock fallback if service isn't reachable
  try {
    // Note: User service requires Auth. We'd forward the token here.
    // const res = await axios.get(`${USER_SERVICE_URL}/api/users/${studentId}`);
    // return res.data;
    
    // Returning mock data for demonstration
    return {
      id: studentId,
      cgpa: 7.8,
      branch: "Computer Science",
      active_backlogs: 1
    };
  } catch (error) {
    console.error("Failed to fetch student data", error.message);
    throw new Error('Student Service Unavailable');
  }
};

const fetchJobData = async (jobId) => {
  // Mock data for Company Service
  return {
    id: jobId,
    title: "Software Engineer",
    min_cgpa: 8.0,
    allowed_branches: ["Computer Science", "Information Technology"],
    allows_backlogs: false
  };
};

exports.checkEligibility = async (req, res) => {
  try {
    const { student_id, job_id } = req.body;

    if (!student_id || !job_id) {
      return res.status(400).json({ error: 'Missing student_id or job_id' });
    }

    const [student, job] = await Promise.all([
      fetchStudentData(student_id),
      fetchJobData(job_id)
    ]);

    const result = evaluateEligibility(student, job);

    res.json(result);
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({ error: 'Internal server error evaluating eligibility' });
  }
};
