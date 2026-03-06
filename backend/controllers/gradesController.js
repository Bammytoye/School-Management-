import pool from '../config/DB.js'

//  GRADES 
const getLetterGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}


// GET /api/grades?course_id=&user_id=
const getGrades = async (req, res, next) => {
    try {
        const { course_id, user_id } = req.query;
        const conditions = ['1=1'];
        const params = [];

        if (course_id) { params.push(course_id); conditions.push(`g.course_id = $${params.length}`); }
        if (user_id) { params.push(user_id); conditions.push(`g.user_id = $${params.length}`); }

        const result = await pool.query(
            `SELECT g.*, u.name AS student_name, u.email, c.title AS course_title
            FROM grades g
            JOIN users u ON g.user_id = u.id
            JOIN courses c ON g.course_id = c.id
            WHERE ${conditions.join(' AND ')}
            ORDER BY g.graded_at DESC`,
            params
        );
        res.json({ success: true, grades: result.rows });
    } catch (err) { next(err); }
};

// POST /api/grades  (admin sets/updates a grade)
const setGrade = async (req, res, next) => {
    try {
        const { user_id, course_id, score, remarks } = req.body;
        if (!user_id || !course_id || score === undefined) {
            return res.status(400).json({ message: 'user_id, course_id, and score are required.' });
        }
        const grade = getLetterGrade(parseFloat(score));

        const result = await pool.query(
            `INSERT INTO grades (user_id, course_id, score, grade, remarks, graded_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id, course_id)
            DO UPDATE SET score=$3, grade=$4, remarks=$5, graded_by=$6, graded_at=NOW()
            RETURNING *`,
            [user_id, course_id, score, grade, remarks || null, req.user.id]
        );
        res.json({ success: true, message: 'Grade saved.', grade: result.rows[0] });
    } catch (err) { next(err); }
};

// GET /api/grades/my  (student sees own grades)
const getMyGrades = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT g.score, g.grade, g.remarks, g.graded_at, c.title AS course_title
            FROM grades g
            JOIN courses c ON g.course_id = c.id
            WHERE g.user_id = $1
            ORDER BY g.graded_at DESC`,
            [req.user.id]
        );
        res.json({ success: true, grades: result.rows });
    } catch (err) { next(err); }
};

// ── ATTENDANCE ──

// GET /api/attendance?course_id=&date=
const getAttendance = async (req, res, next) => {
    try {
        const { course_id, date } = req.query;
        if (!course_id) return res.status(400).json({ message: 'course_id is required.' });

        const params = [course_id];
        let dateFilter = '';
        if (date) { params.push(date); dateFilter = `AND a.date = $${params.length}`; }

        const result = await pool.query(
            `SELECT a.*, u.name AS student_name, u.email
            FROM attendance a
            JOIN users u ON a.user_id = u.id
            WHERE a.course_id = $1 ${dateFilter}
            ORDER BY a.date DESC, u.name ASC`,
            params
        );
        res.json({ success: true, attendance: result.rows });
    } catch (err) { next(err); }
};

// POST /api/attendance  (admin marks attendance — bulk)
const markAttendance = async (req, res, next) => {
    try {
        const { course_id, date, records } = req.body;
        // records: [{ user_id, status }]
        if (!course_id || !date || !records?.length) {
            return res.status(400).json({ message: 'course_id, date, and records are required.' });
        }

        const saved = [];
        for (const r of records) {
            const result = await pool.query(
                `INSERT INTO attendance (user_id, course_id, date, status, marked_by)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, course_id, date)
            DO UPDATE SET status=$4, marked_by=$5
            RETURNING *`,
                [r.user_id, course_id, date, r.status, req.user.id]
            );
            saved.push(result.rows[0]);
        }
        res.json({ success: true, message: 'Attendance marked.', saved });
    } catch (err) { next(err); }
};

// GET /api/attendance/my  (student sees own attendance)
const getMyAttendance = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT a.date, a.status, c.title AS course_title
            FROM attendance a
            JOIN courses c ON a.course_id = c.id
            WHERE a.user_id = $1
            ORDER BY a.date DESC`,
            [req.user.id]
        );
        res.json({ success: true, attendance: result.rows });
    } catch (err) { next(err); }
};

export { getGrades, setGrade, getMyGrades, getAttendance, markAttendance, getMyAttendance };