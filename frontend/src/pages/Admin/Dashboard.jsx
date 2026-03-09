import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { StatCardSkeleton } from '../../components/Skeleton'
import { enrolmentAPI } from '../../api/enrolmentAPI'

const StatCard = ({ icon, label, value, color, to }) => (
    <Link to={to} className="card flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">{label}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{value ?? '—'}</p>
        </div>
    </Link>
)

export default function Dashboard() {
    const [stats, setStats]   = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        enrolmentAPI.getStats()
            .then((res) => setStats(res.data.stats))
            .finally(() => setLoading(false))
    }, [])

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard icon="👥" label="Total Students"   value={stats?.total_students}   color="bg-blue-100 dark:bg-blue-900/30"   to="/admin/students" />
                        <StatCard icon="📚" label="Total Courses"    value={stats?.total_courses}    color="bg-green-100 dark:bg-green-900/30"  to="/admin/courses" />
                        <StatCard icon="📋" label="Enrolment"       value={stats?.total_enrolment} color="bg-purple-100 dark:bg-purple-900/30" to="/admin/enrolments" />
                        <StatCard icon="👑" label="Admins"           value={stats?.total_admins}     color="bg-orange-100 dark:bg-orange-900/30" to="/admin/students" />
                    </>
                )}
            </div>

            <div className="card">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/admin/students"   className="btn-primary text-sm">➕ Add Student</Link>
                    <Link to="/admin/courses"    className="btn-primary text-sm">📚 Add Course</Link>
                    <Link to="/admin/enrolment" className="btn-primary text-sm">📋 Manage Enrolment</Link>
                    <Link to="/admin/grades"     className="btn-secondary text-sm">🎯 Grade Students</Link>
                    <Link to="/admin/attendance" className="btn-secondary text-sm">🗓️ Mark Attendance</Link>
                </div>
            </div>
        </AdminLayout>
    )
}