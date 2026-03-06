import bcrypt from 'bcryptjs'
import UserModel from '../models/userModel.js'

// GET /api/users?page=1&search=&role=
const getUsers = async (req, res, next) => {
    try {
        const { search = '', page = 1, limit = 10, role } = req.query;
        const data = await UserModel.findAll({ search, page: parseInt(page), limit: parseInt(limit), role });
        res.json({ success: true, ...data });
    } catch (err) {
        next(err);
    }
};

// GET /api/users/:id
const getUserById = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// POST /api/users  (admin creates a user)
const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const existing = await UserModel.findByEmail(email);
        if (existing) return res.status(409).json({ message: 'Email already in use.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ name, email, password: hashedPassword, role: role || 'student' });

        res.status(201).json({ success: true, message: 'User created.', user });
    } catch (err) {
        next(err);
    }
};

// PUT /api/users/:id
const updateUser = async (req, res, next) => {
    try {
        const { name, email, role } = req.body;
        const user = await UserModel.update(req.params.id, { name, email, role });
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json({ success: true, message: 'User updated.', user });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
    try {
        // Prevent admin from deleting themselves
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete your own account.' });
        }
        const deleted = await UserModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'User not found.' });
        res.json({ success: true, message: 'User deleted.' });
    } catch (err) {
        next(err);
    }
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };