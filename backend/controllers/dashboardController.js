import pool from '../config/DB.js'

// getDashboardCharts
export const getDashboardCharts = async (req, res, next) => {
    try {
        const [enrolMonthRes, gradeDistRes, topCoursesRes, attendRes] = await Promise.all([

            // Enrolments by month (last 8 months)
            pool.query(`
                SELECT TO_CHAR(enrolled_at, 'Mon YY') AS month,
                DATE_TRUNC('month', enrolled_at) AS month_date,
                COUNT(*) AS count
                FROM enrolments
                WHERE enrolled_at >= NOW() - INTERVAL '8 months'
                GROUP BY month, month_date
                ORDER BY month_date ASC
            `),

            // Grade distribution
            pool.query(`
                SELECT grade, COUNT(*) AS count
                FROM grades
                GROUP BY grade
                ORDER BY grade ASC
            `),

            // Top 5 courses by enrolment count
            pool.query(`
                SELECT c.title, COUNT(e.id) AS count
                FROM courses c
                LEFT JOIN enrolments e ON c.id = e.course_id
                GROUP BY c.id, c.title
                ORDER BY count DESC
                LIMIT 5
            `),

            // Attendance summary (present/absent/late totals)
            pool.query(`
                SELECT status, COUNT(*) AS count
                FROM attendance
                GROUP BY status
            `),
        ])

        res.json({
            success: true,
            enrolmentsByMonth: enrolMonthRes.rows.map(r => ({
                month: r.month,
                count: parseInt(r.count),
            })),
            gradeDistribution: gradeDistRes.rows.map(r => ({
                grade: r.grade,
                count: parseInt(r.count),
            })),
            topCourses: topCoursesRes.rows.map(r => ({
                title: r.title.length > 15 ? r.title.substring(0, 15) + '…' : r.title,
                count: parseInt(r.count),
            })),
            attendanceSummary: attendRes.rows.map(r => ({
                status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
                count: parseInt(r.count),
            })),
        })
    } catch (err) { next(err) }
}

//get stats
export const getStats = async (req, res, next) => {
    try {
        const [students, courses, enrolments, admins] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'"),
            pool.query("SELECT COUNT(*) FROM courses"),
            pool.query("SELECT COUNT(*) FROM enrolments"),
            pool.query("SELECT COUNT(*) FROM users WHERE role = 'admin'")
        ]);

        res.json({
            success: true,
            stats: {
                total_students: parseInt(students.rows[0].count),
                total_courses: parseInt(courses.rows[0].count),
                total_enrolment: parseInt(enrolments.rows[0].count),
                total_admins: parseInt(admins.rows[0].count),
            }
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        next(err);
    }
};

