import express from 'express';
const router = express.Router();
import { getNotifications } from '../controllers/notifications.js';
import { getTimelines } from '../controllers/timelines.js';
import { getExperiences, addExperience } from '../controllers/experiences.js';
import { getRiskAnalysis } from '../controllers/risk.js';
import { getCompanies, getCompanyById, getCompanyStats, createCompany, updateCompany, deleteCompany } from '../controllers/companies.js';
import { login, register, getMe } from '../controllers/auth.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Placement Intelligence API root',
    endpoints: {
      companies: '/companies',
      companyById: '/companies/:id',
      companyStats: '/companies/stats',
      notifications: '/notifications',
      timelines: '/timelines/:companyId',
      experiences: '/experiences/:companyId',
      riskAnalysis: '/risk-analysis/:companyId',
      auth: {
        login: '/auth/login',
        register: '/auth/register',
        me: '/auth/me'
      }
    }
  });
});

// ── Authentication ──
router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/auth/me', verifyToken, getMe);

// ── Companies (Main Data Pipeline) ──
router.get('/companies', getCompanies);
router.get('/companies/stats', getCompanyStats);
router.get('/companies/:id', getCompanyById);
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

// ── Notifications ──
router.get('/notifications', getNotifications);

// ── Placement Timelines ──
router.get('/timelines/:companyId', getTimelines);

// ── Interview Experiences ──
router.get('/experiences/:companyId', getExperiences);
router.post('/experiences', addExperience);

// ── Candidate Risk Analysis ──
router.get('/risk-analysis/:companyId', getRiskAnalysis);

export default router;
