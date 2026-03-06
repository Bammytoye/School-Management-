import express from 'express'
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js'
import roleMiddleware from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js'

const userRouter = express.Router();

// All user routes require auth + admin role
userRouter.use(authMiddleware, roleMiddleware('admin'));

userRouter.get('/',     getUsers);
userRouter.get('/:id',  getUserById);
userRouter.post('/',    createUser);
userRouter.put('/:id',  updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;