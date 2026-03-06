import pool from '../config/DB.js'

const UserModel = {
    // Find user by email
    findByEmail: async (email) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },

    // Find user by ID
    findById: async (id) => {
        const result = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    // Create a new user
    create: async ({ name, email, password, role = 'student' }) => {
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at`,
            [name, email, password, role]
        );
        return result.rows[0];
    },

    // Get all users with pagination + search (admin)
    findAll: async ({ search = '', page = 1, limit = 10, role }) => {
        const offset = (page - 1) * limit;
        const conditions = ['1=1'];
        const params = [];

        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
        }

        if (role) {
            params.push(role);
            conditions.push(`role = $${params.length}`);
        }

        const where = conditions.join(' AND ');

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM users WHERE ${where}`,
            params
        );

        params.push(limit, offset);
        const dataResult = await pool.query(
            `SELECT id, name, email, role, created_at
       FROM users
       WHERE ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        return {
            users: dataResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        };
    },

    // Update user
    update: async (id, { name, email, role }) => {
        const result = await pool.query(
            `UPDATE users SET name=$1, email=$2, role=$3
       WHERE id=$4
       RETURNING id, name, email, role, created_at`,
            [name, email, role, id]
        );
        return result.rows[0];
    },

    // Delete user
    delete: async (id) => {
        const result = await pool.query(
            'DELETE FROM users WHERE id=$1 RETURNING id',
            [id]
        );
        return result.rows[0];
    },
};

export default UserModel;