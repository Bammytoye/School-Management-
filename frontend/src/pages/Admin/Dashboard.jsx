import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts'
import AdminLayout from '../../components/AdminLayout'
import { StatCardSkeleton } from '../../components/Skeleton'
import Tooltip from '../../components/Tooltip'
import useCountUp from '../../hooks/UseCountUp'
import { enrolmentAPI } from '../../API/enrolmentAPI'
import { useAuth } from '../../context/AuthContext'
import api from '../../API/axios'

// ── Animated Stat Card ──────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, to, hint }) {
    const count = useCountUp(value)
    return (
        <Tooltip text={hint || label}>
            <Link to={to} className="card flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${color}`}>{icon}</div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white tabular-nums">
                        {value === null ? '—' : count}
                    </p>
                </div>
            </Link>
        </Tooltip>
    )
}

// ── Greeting ────────────────────────────────────────────────────────────────
function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
}

const CHART_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']

export default function Dashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [enrolByMonth, setEnrolMonth] = useState([])
    const [gradesDist, setGradesDist] = useState([])
    const [topCourses, setTopCourses] = useState([])
    const [attendSum, setAttendSum] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const [statsRes, chartsRes] = await Promise.all([
                    enrolmentAPI.getStats(),
                    api.get('/dashboard/charts'),
                ])
                setStats(statsRes.data.stats)
                const c = chartsRes.data
                setEnrolMonth(c.enrolmentsByMonth || [])
                setGradesDist(c.gradeDistribution || [])
                setTopCourses(c.topCourses || [])
                setAttendSum(c.attendanceSummary || [])
            } catch {
                // charts endpoint might not exist yet — stats only
                try {
                    const s = await enrolmentAPI.getStats()
                    setStats(s.data.stats)
                } catch (error) {
                    console.log(error)
                }
            } finally { setLoading(false) }
        }
        load()
    }, [])

    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <AdminLayout>
            {/* ── Welcome Banner ── */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <p className="text-blue-100 text-sm font-medium">{today}</p>
                    <h1 className="text-2xl font-bold mt-1">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-blue-100 text-sm mt-1">Here's what's happening at your school today.</p>
                </div>
                <div className="text-5xl select-none">🏫</div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard icon="👥" label="Students" value={stats?.total_students} color="bg-blue-100 dark:bg-blue-900/30" to="/admin/students" hint="Total registered students" />
                        <StatCard icon="📚" label="Courses" value={stats?.total_courses} color="bg-green-100 dark:bg-green-900/30" to="/admin/courses" hint="Total courses available" />
                        <StatCard icon="📋" label="Enrolment" value={stats?.total_enrolment} color="bg-purple-100 dark:bg-purple-900/30" to="/admin/enrolment" hint="Total active enrolments" />
                        <StatCard icon="👑" label="Admins" value={stats?.total_admins} color="bg-orange-100 dark:bg-orange-900/30" to="/admin/students" hint="Total admin accounts" />
                    </>
                )}
            </div>

            {/* ── Charts Row 1 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* Enrolments by Month */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-200">📈 Enrolments Over Time</h2>
                        <Tooltip text="Monthly enrolment trend"><span className="text-gray-400 text-sm cursor-help">ⓘ</span></Tooltip>
                    </div>
                    {enrolByMonth.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">No data yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={enrolByMonth}>
                                <defs>
                                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                <RechartTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#blueGrad)" name="Enrolments" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Grade Distribution */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-200">🎯 Grade Distribution</h2>
                        <Tooltip text="Breakdown of all grades awarded"><span className="text-gray-400 text-sm cursor-help">ⓘ</span></Tooltip>
                    </div>
                    {gradesDist.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">No grades yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={gradesDist} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={75} label={({ grade, percent }) => `${grade} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    {gradesDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                </Pie>
                                <RechartTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* ── Charts Row 2 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* Top Courses by Enrolment */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-200">📚 Top Courses</h2>
                        <Tooltip text="Courses with most students"><span className="text-gray-400 text-sm cursor-help">ⓘ</span></Tooltip>
                    </div>
                    {topCourses.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">No enrolments yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={topCourses} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                                <YAxis type="category" dataKey="title" tick={{ fontSize: 11 }} width={110} />
                                <RechartTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                <Bar dataKey="count" name="Students" radius={[0, 4, 4, 0]}>
                                    {topCourses.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Attendance Summary */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-200">🗓️ Attendance Summary</h2>
                        <Tooltip text="Overall attendance breakdown"><span className="text-gray-400 text-sm cursor-help">ⓘ</span></Tooltip>
                    </div>
                    {attendSum.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">No attendance records yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={attendSum} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={75} label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#ef4444" />
                                    <Cell fill="#f59e0b" />
                                </Pie>
                                <RechartTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div className="card">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">⚡ Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/admin/students" className="btn-primary text-sm">➕ Add Student</Link>
                    <Link to="/admin/courses" className="btn-primary text-sm">📚 Add Course</Link>
                    <Link to="/admin/enrolment" className="btn-primary text-sm">📋 Manage Enrolment</Link>
                    <Link to="/admin/grades" className="btn-secondary text-sm">🎯 Grade Students</Link>
                    <Link to="/admin/attendance" className="btn-secondary text-sm">🗓️ Mark Attendance</Link>
                </div>
            </div>
        </AdminLayout>
    )
}