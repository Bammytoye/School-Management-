import express from 'express'
import { getDashboardCharts, getStats } from '../controllers/dashboardController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'

const dashboardRouter = express.Router()

dashboardRouter.get('/charts', authMiddleware, roleMiddleware('admin'), getDashboardCharts)
dashboardRouter.get('/stats', authMiddleware, roleMiddleware('admin'), getStats)

export default dashboardRouter