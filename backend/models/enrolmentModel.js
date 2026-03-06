import pool from '../config/DB.js'

const EnrolmentModel = {
    // Enrol student into course
    enrol: async ({ user_id, course_id }) => {
        const result = await pool.query(
            `INSERT INTO enrolments (user_id, course_id)
       VALUES ($1, $2)
       RETURNING *`,
            [user_id, course_id]
        );
        return result.rows[0];
    },

    // Check if already enrolled
    exists: async ({ user_id, course_id }) => {
        const result = await pool.query(
            'SELECT id FROM enrolments WHERE user_id=$1 AND course_id=$2',
            [user_id, course_id]
        );
        return result.rows[0];
    },

    // Get courses for a student
    getStudentCourses: async (user_id) => {
        const result = await pool.query(
            `SELECT c.id, c.title, c.description, c.created_at, e.enrolled_at
       FROM enrolments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = $1
       ORDER BY e.enrolled_at DESC`,
            [user_id]
        );
        return result.rows;
    },

    // Get all enrolments (admin view)
    findAll: async () => {
        const result = await pool.query(
            `SELECT e.id, e.enrolled_at,
              u.id AS student_id, u.name AS student_name, u.email,
              c.id AS course_id, c.title AS course_title
       FROM enrolments e
       JOIN users u ON e.user_id = u.id
       JOIN courses c ON e.course_id = c.id
       ORDER BY e.enrolled_at DESC`
        );
        return result.rows;
    },

    // Remove enrolment
    delete: async (id) => {
        const result = await pool.query(
            'DELETE FROM enrolments WHERE id=$1 RETURNING id',
            [id]
        );
        return result.rows[0];
    },

    // Stats for dashboard
    getStats: async () => {
        const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role='student') AS total_students,
        (SELECT COUNT(*) FROM users WHERE role='admin')   AS total_admins,
        (SELECT COUNT(*) FROM courses)                    AS total_courses,
        (SELECT COUNT(*) FROM enrolments)                 AS total_enrolments
    `);
        return result.rows[0];
    },
};

export default EnrolmentModel;