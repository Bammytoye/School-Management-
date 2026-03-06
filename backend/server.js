import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import  errorMiddleware from './middleware/errorMiddleware.js'
import  authRouter from './routes/authRoutes.js'
import  userRouter from './routes/userRoutes.js'
import  courseRouter from './routes/courseRoutes.js'
import  enrolmentRouter from './routes/enrolmentRoutes.js'    
import pool from './config/DB.js'

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// ── Security & Utilities ──
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: '🏫 School Management API is running' });
});

// ── Routes ──
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/enrolments', enrolmentRouter);

// ── 404 handler ──
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// ── Global error handler ──
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`School Management Backend running on port ${port}`);
});