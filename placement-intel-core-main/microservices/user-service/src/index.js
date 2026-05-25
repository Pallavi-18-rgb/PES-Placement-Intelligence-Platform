const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userController = require('./controllers/userController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'user-service' });
});

// API Routes
app.get('/api/users/me', userController.getCurrentUser);
app.put('/api/users/:id', userController.updateUser);

// Start server
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
