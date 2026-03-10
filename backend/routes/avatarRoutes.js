import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'
import pool from '../config/DB.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '../../uploads/avatars')

// Create upload folder if it doesn't exist
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename:    (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`)
    },
})

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp']
        const ext = path.extname(file.originalname).toLowerCase()
        if (allowed.includes(ext)) cb(null, true)
        else cb(new Error('Only JPG, PNG, WEBP images are allowed.'))
    },
})

const avatarRouter = express.Router()
avatarRouter.use(authMiddleware)

// POST /api/avatar — upload profile photo
avatarRouter.post('/', upload.single('avatar'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })

        const avatarUrl = `/uploads/avatars/${req.file.filename}`

        // Delete old avatar file if it exists
        const old = await pool.query('SELECT avatar_url FROM users WHERE id=$1', [req.user.id])
        const oldUrl = old.rows[0]?.avatar_url
        if (oldUrl) {
            const oldPath = path.join(__dirname, '../..', oldUrl)
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        }

        // Save new avatar URL to DB
        const result = await pool.query(
            'UPDATE users SET avatar_url=$1 WHERE id=$2 RETURNING id, name, email, role, avatar_url',
            [avatarUrl, req.user.id]
        )

        res.json({ success: true, user: result.rows[0], avatarUrl })
    } catch (err) { next(err) }
})

// DELETE /api/avatar — remove profile photo
avatarRouter.delete('/', async (req, res, next) => {
    try {
        const old = await pool.query('SELECT avatar_url FROM users WHERE id=$1', [req.user.id])
        const oldUrl = old.rows[0]?.avatar_url
        if (oldUrl) {
            const oldPath = path.join(__dirname, '../..', oldUrl)
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        }
        await pool.query('UPDATE users SET avatar_url=NULL WHERE id=$1', [req.user.id])
        res.json({ success: true, message: 'Avatar removed.' })
    } catch (err) { next(err) }
})

export default avatarRouter