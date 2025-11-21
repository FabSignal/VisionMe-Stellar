import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
import authRoutes from './routes/auth';
import pocketRoutes from './routes/pockets';
import depositRoutes from './routes/deposits';
import streakRoutes from './routes/streaks';
import sbtRoutes from './routes/sbt';

app.use('/api/auth', authRoutes);
app.use('/api/pockets', pocketRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/sbt', sbtRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`VisionMe Backend running on port ${PORT}`);
});