import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5010;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Placement Intelligence Backend is running smoothly!' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('<h1>Placement Intelligence Backend is Running!</h1><p>Go to <a href="/api/health">/api/health</a> to check API status.</p>');
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
