const express = require('express');
const cors = require('cors');
require('dotenv').config();
const eligibilityController = require('./controllers/eligibilityController');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'eligibility-engine' });
});

app.post('/api/eligibility/check', eligibilityController.checkEligibility);

app.listen(PORT, () => {
  console.log(`Eligibility Engine running on port ${PORT}`);
});
