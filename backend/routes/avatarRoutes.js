import express from 'express'
import { upload } from '../config/cloudinary.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { uploadAvatar, deleteAvatar } from '../controllers/avatarController.js'

const avatarRouter = express.Router()

avatarRouter.use(authMiddleware)

avatarRouter.post('/', upload.single('avatar'), uploadAvatar)
avatarRouter.delete('/', deleteAvatar)

export default avatarRouter