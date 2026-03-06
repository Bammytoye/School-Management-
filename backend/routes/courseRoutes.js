import express from 'express'
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js'
import roleMiddleware from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js'

const courseRouter = express.Router();

// All require auth
courseRouter.use(authMiddleware);

courseRouter.get('/', getCourses);       // both admin & student
courseRouter.get('/:id', getCourseById);    // both

// Admin only
courseRouter.post('/', roleMiddleware('admin'), createCourse);
courseRouter.put('/:id', roleMiddleware('admin'), updateCourse);
courseRouter.delete('/:id', roleMiddleware('admin'), deleteCourse);

export default courseRouter;