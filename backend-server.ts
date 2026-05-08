import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Импорт маршрутов
import authRoutes from './routes/auth';
import textbookRoutes from './routes/textbooks';
import aiRoutes from './routes/ai';
import userRoutes from './routes/user';

// Инициализация Express
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // лимит 100 запросов на IP
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'GDZ AI Backend is running' });
});

// API маршруты
app.use('/api/auth', authRoutes);
app.use('/api/textbooks', textbookRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${5000}`);
  console.log(`📚 GDZ AI Backend started successfully`);
});

export default app;
