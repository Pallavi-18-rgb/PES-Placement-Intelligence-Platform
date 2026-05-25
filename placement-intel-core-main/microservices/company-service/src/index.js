const express = require('express');
const cors = require('cors');
require('dotenv').config();
const companyController = require('./controllers/companyController');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'company-service' });
});

// APIs
app.get('/api/companies', companyController.getAllCompanies);
app.get('/api/companies/stats', companyController.getCompanyStats);
app.get('/api/companies/:id', companyController.getCompanyById);

app.get('/api/notifications', companyController.getRecentNotifications);
app.post('/api/jobs', companyController.createJob);

app.listen(PORT, () => {
  console.log(`Company Service running on port ${PORT}`);
});
