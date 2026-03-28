import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import errorMiddleware from './middleware/errorMiddleware.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import courseRouter from './routes/courseRoutes.js'
import enrolmentRouter from './routes/enrolmentRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import gradesRoutes from './routes/gradesRoutes.js'
import avatarRouter from './routes/avatarRoutes.js'
import dashboardRouter from './routes/dashboardRoutes.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 8000

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // ✅ Added fallback for development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'School Management API is running' })
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/courses', courseRouter)
app.use('/api/enrolments', enrolmentRouter)
app.use('/api/profile', profileRoutes)
app.use('/api', gradesRoutes)
app.use('/api/avatar', avatarRouter)
app.use('/api/dashboard', dashboardRouter)

// 404 handler (3 parameters - regular middleware)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Global error handler (4 parameters - error middleware) - MUST BE LAST
app.use((err, req, res, next) => {
    console.error('ERROR:', err.message);
    console.error('Stack:', err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

// ✅ You can also keep your errorMiddleware if you prefer
// app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
})