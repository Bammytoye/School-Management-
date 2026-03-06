import express from 'express'
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const profileRouter  = express.Router();

profileRouter.use(authMiddleware);

profileRouter.get('/',           getProfile);
profileRouter.put('/',           updateProfile);
profileRouter.put('/password',   changePassword);

export default profileRouter;