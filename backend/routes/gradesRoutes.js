import express from 'express'
import {
    getGrades, setGrade, getMyGrades,
    getAttendance, markAttendance, getMyAttendance,
} from '../controllers/gradesController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'

const gradesRouter = express.Router()

gradesRouter.use(authMiddleware)

// Grades
gradesRouter.get('/grades/my', getMyGrades)
gradesRouter.get('/grades', roleMiddleware('admin'), getGrades)
gradesRouter.post('/grades', roleMiddleware('admin'), setGrade)

// Attendance
gradesRouter.get('/attendance/my', getMyAttendance)
gradesRouter.get('/attendance', roleMiddleware('admin'), getAttendance)
gradesRouter.post('/attendance', roleMiddleware('admin'), markAttendance)

export default gradesRouter