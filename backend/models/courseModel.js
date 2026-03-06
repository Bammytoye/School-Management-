import pool from '../config/DB.js'


const CourseModel = {
    // Get all courses with pagination + search
    findAll: async ({ search = '', page = 1, limit = 10 }) => {
        const offset = (page - 1) * limit;
        const params = [];
        let where = '1=1';

        if (search) {
            params.push(`%${search}%`);
            where += ` AND (c.title ILIKE $${params.length} OR c.description ILIKE $${params.length})`;
        }

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM courses c WHERE ${where}`,
            params
        );

        params.push(limit, offset);
        const dataResult = await pool.query(
            `SELECT c.id, c.title, c.description, c.created_at,
            u.name AS created_by_name
            FROM courses c
            LEFT JOIN users u ON c.created_by = u.id
            WHERE ${where}
            ORDER BY c.created_at DESC
            LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        return {
            courses: dataResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        };
    },

    // Find by ID
    findById: async (id) => {
        const result = await pool.query(
            `SELECT c.*, u.name AS created_by_name
       FROM courses c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.id = $1`,
            [id]
        );
        return result.rows[0];
    },

    // Create
    create: async ({ title, description, created_by }) => {
        const result = await pool.query(
            `INSERT INTO courses (title, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [title, description, created_by]
        );
        return result.rows[0];
    },

    // Update
    update: async (id, { title, description }) => {
        const result = await pool.query(
            `UPDATE courses SET title=$1, description=$2
       WHERE id=$3
       RETURNING *`,
            [title, description, id]
        );
        return result.rows[0];
    },

    // Delete
    delete: async (id) => {
        const result = await pool.query(
            'DELETE FROM courses WHERE id=$1 RETURNING id',
            [id]
        );
        return result.rows[0];
    },
};

export default CourseModel;