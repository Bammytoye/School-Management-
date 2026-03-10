import bcrypt from 'bcryptjs'
import pool from '../config/DB.js';

// GET /api/profile
const getProfile = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, created_at, avatar_url FROM users WHERE id = $1',
            [req.user.id]
        );
        if (!result.rows[0]) return res.status(404).json({ message: 'User not found.' });
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

// PUT /api/profile
const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ message: 'Name and email are required.' });

        // Check email not taken by someone else
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1 AND id != $2',
            [email, req.user.id]
        );
        if (existing.rows[0]) return res.status(409).json({ message: 'Email already in use.' });

        const result = await pool.query(
            'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, role, created_at',
            [name, email, req.user.id]
        );
        res.json({ success: true, message: 'Profile updated.', user: result.rows[0] });
    } catch (err) { next(err); }
};

// PUT /api/profile/password
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters.' });
        }

        const result = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hashed, req.user.id]);

        res.json({ success: true, message: 'Password changed successfully.' });
    } catch (err) { next(err); }
};

export { getProfile, updateProfile, changePassword };