const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authenticate = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 8082;

app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[API Gateway] ${req.method} ${req.url}`);
  next();
});

// Rate limiting to prevent bot spam
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per `window`
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

const proxyOptions = {
    onProxyReq: (proxyReq, req, res) => {
        if (req.user) {
            proxyReq.setHeader('x-user-id', req.user?.id || req.user?.userId || 'unknown');
            proxyReq.setHeader('x-user-role', req.user.role || 'unknown');
        }
    }
};

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

// Downstream Service URLs
const SERVICES = {
  USER: process.env.USER_SERVICE_URL || 'http://user-service:3001',
  ELIGIBILITY: process.env.ELIGIBILITY_SERVICE_URL || 'http://eligibility-engine:3002',
  COMPANY: process.env.COMPANY_SERVICE_URL || 'http://company-service:3003',
  AGENT: process.env.AGENT_SERVICE_URL || 'http://agent-service:8000'
};

// --- ROUTES --- //

// 1. User Service routes
app.use('/api/users', authenticate, createProxyMiddleware({ 
  target: SERVICES.USER, 
  changeOrigin: true,
  ...proxyOptions
}));

// 2. Eligibility Engine routes
app.use('/api/eligibility', authenticate, createProxyMiddleware({ 
  target: SERVICES.ELIGIBILITY, 
  changeOrigin: true,
  ...proxyOptions
}));

// 3. Company Service routes
app.use('/api/companies', authenticate, createProxyMiddleware({ 
  target: SERVICES.COMPANY, 
  changeOrigin: true,
  ...proxyOptions
}));
app.use('/api/jobs', authenticate, createProxyMiddleware({ 
  target: SERVICES.COMPANY, 
  changeOrigin: true,
  ...proxyOptions
}));
app.use('/api/notifications', authenticate, createProxyMiddleware({ 
  target: SERVICES.COMPANY, 
  changeOrigin: true,
  ...proxyOptions
}));

// 4. Agent Service routes
app.use('/api/agent', authenticate, createProxyMiddleware({ 
  target: SERVICES.AGENT, 
  changeOrigin: true,
  ...proxyOptions
}));

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
