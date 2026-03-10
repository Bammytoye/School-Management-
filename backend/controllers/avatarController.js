import fs from "fs";
import path from "path";
import pool from "../config/DB.js"; 
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded." });

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        // Delete old avatar if exists
        const old = await pool.query("SELECT avatar_url FROM users WHERE id=$1", [req.user.id]);
        const oldUrl = old.rows[0]?.avatar_url;
        if (oldUrl) {
            const oldPath = path.join(__dirname, "..", oldUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // Save new avatar
        const result = await pool.query(
            "UPDATE users SET avatar_url=$1 WHERE id=$2 RETURNING id, name, email, role, created_at, avatar_url",
            [avatarUrl, req.user.id]
        );

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

export const deleteAvatar = async (req, res, next) => {
    try {
        const old = await pool.query("SELECT avatar_url FROM users WHERE id=$1", [req.user.id]);
        const oldUrl = old.rows[0]?.avatar_url;
        if (oldUrl) {
            const oldPath = path.join(__dirname, "..", oldUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        await pool.query("UPDATE users SET avatar_url=NULL WHERE id=$1", [req.user.id]);
        res.json({ success: true, message: "Avatar removed." });
    } catch (err) {
        next(err);
    }
};