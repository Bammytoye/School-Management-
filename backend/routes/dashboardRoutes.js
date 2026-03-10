import express from 'express'
import { getDashboardCharts } from '../controllers/dashboardController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'

const dashboardRouter = express.Router()

dashboardRouter.get('/charts', authMiddleware, roleMiddleware('admin'), getDashboardCharts)

export default dashboardRouter