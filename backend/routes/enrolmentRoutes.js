import express from 'express'
import { enrolStudent, getMyCourses, getAllEnrolments, removeEnrolment, getStats } from '../controllers/enrolmentController.js'
import roleMiddleware from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js'

const enrolmentRouter = express.Router();
enrolmentRouter.use(authMiddleware);

enrolmentRouter.get('/my', getMyCourses);                              // student
enrolmentRouter.get('/stats', roleMiddleware('admin'), getStats);         // admin
enrolmentRouter.get('/', roleMiddleware('admin'), getAllEnrolments);  // admin
enrolmentRouter.post('/', roleMiddleware('admin'), enrolStudent);      // admin
enrolmentRouter.delete('/:id', roleMiddleware('admin'), removeEnrolment); // admin

export default enrolmentRouter;