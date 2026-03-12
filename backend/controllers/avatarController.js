import pool from '../config/DB.js'
import cloudinary from '../config/cloudinary.js'

export const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })

        // Delete old avatar from Cloudinary if exists
        const old = await pool.query('SELECT avatar_url FROM users WHERE id=$1', [req.user.id])
        const oldUrl = old.rows[0]?.avatar_url

        if (oldUrl) {
            // Extract public_id from Cloudinary URL
            const parts = oldUrl.split('/')
            const filename = parts[parts.length - 1].split('.')[0]
            const publicId = `school-ms/avatars/${filename}`
            await cloudinary.uploader.destroy(publicId)
        }

        // Cloudinary URL comes from req.file.path
        const avatarUrl = req.file.path

        const result = await pool.query(
            'UPDATE users SET avatar_url=$1 WHERE id=$2 RETURNING id, name, email, role, created_at, avatar_url',
            [avatarUrl, req.user.id]
        )

        res.json({ success: true, user: result.rows[0] })
    } catch (err) {
        console.error('Avatar upload error:', err)
        next(err)
    }
}

export const deleteAvatar = async (req, res, next) => {
    try {
        const old = await pool.query('SELECT avatar_url FROM users WHERE id=$1', [req.user.id])
        const oldUrl = old.rows[0]?.avatar_url

        if (oldUrl) {
            const parts = oldUrl.split('/')
            const filename = parts[parts.length - 1].split('.')[0]
            const publicId = `school-ms/avatars/${filename}`
            await cloudinary.uploader.destroy(publicId)
        }

        await pool.query('UPDATE users SET avatar_url=NULL WHERE id=$1', [req.user.id])
        res.json({ success: true, message: 'Avatar removed.' })
    } catch (err) {
        next(err)
    }
}