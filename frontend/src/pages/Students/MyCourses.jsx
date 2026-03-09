import { useState, useEffect } from 'react'
import Navbar from '../../components/NavBar'
import Breadcrumb from '../../components/Breadcrumb'
import EmptyState from '../../components/EmptyState'
import { CourseCardSkeleton, Skeleton } from '../../components/Skeleton'
import { enrolmentAPI } from '../../API/enrolmentAPI'
import { gradesAPI, attendanceAPI } from '../../API/gradesAPI'
import { useAuth } from '../../context/AuthContext'

const GRADE_COLORS = {
    A: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    C: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    D: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    F: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}
const STATUS_COLORS = {
    present: 'text-green-600 dark:text-green-400',
    absent: 'text-red-500 dark:text-red-400',
    late: 'text-yellow-600 dark:text-yellow-400',
}

export default function MyCourses() {
    const { user } = useAuth()
    const [tab, setTab] = useState('courses')
    const [courses, setCourses] = useState([])
    const [grades, setGrades] = useState([])
    const [attendance, setAttend] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            enrolmentAPI.getMy(),
            gradesAPI.getMy(),
            attendanceAPI.getMy(),
        ]).then(([c, g, a]) => {
            setCourses(c.data.courses)
            setGrades(g.data.grades)
            setAttend(a.data.attendance)
        }).finally(() => setLoading(false))
    }, [])

    const presentPct = attendance.length
        ? Math.round((attendance.filter((a) => a.status === 'present').length / attendance.length) * 100)
        : null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Navbar />
            <main className="max-w-4xl mx-auto p-6">
                <Breadcrumb />

                {/* Header */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Learning</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.name}!</p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 w-20">
                                    <Skeleton className="h-8 w-8 mx-auto mb-1" />
                                    <Skeleton className="h-3 w-12 mx-auto" />
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-center">
                                    <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Courses</p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-center">
                                    <p className="text-2xl font-bold text-green-600">{grades.length}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Graded</p>
                                </div>
                                {presentPct !== null && (
                                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-center">
                                        <p className="text-2xl font-bold text-purple-600">{presentPct}%</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
                    {[['courses', '📚 Courses'], ['grades', '📊 Grades'], ['attendance', '📋 Attendance']].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key
                                    ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Courses Tab */}
                {tab === 'courses' && (
                    loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="card">
                            <EmptyState type="courses_student" title="No courses yet" description="Your admin will enrol you in courses soon." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {courses.map((c) => {
                                const grade = grades.find((g) => g.course_title === c.title)
                                return (
                                    <div key={c.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📖</div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 dark:text-white">{c.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{c.description || 'No description.'}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Enrolled: {new Date(c.enrolled_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {grade && <span className={`px-2 py-0.5 rounded-full text-sm font-bold flex-shrink-0 ${GRADE_COLORS[grade.grade] || ''}`}>{grade.grade}</span>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                )}

                {/* Grades Tab */}
                {tab === 'grades' && (
                    loading ? (
                        <div className="card space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    ) : grades.length === 0 ? (
                        <div className="card">
                            <EmptyState type="grades" title="No grades yet" description="Your grades will appear here once your admin has graded your courses." />
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        <th className="px-5 py-3">Course</th>
                                        <th className="px-5 py-3">Score</th>
                                        <th className="px-5 py-3">Grade</th>
                                        <th className="px-5 py-3">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.map((g, i) => (
                                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{g.course_title}</td>
                                            <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{g.score}%</td>
                                            <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${GRADE_COLORS[g.grade] || ''}`}>{g.grade}</span></td>
                                            <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{g.remarks || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* Attendance Tab */}
                {tab === 'attendance' && (
                    loading ? (
                        <div className="card space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    ) : attendance.length === 0 ? (
                        <div className="card">
                            <EmptyState type="attendance" title="No attendance records" description="Your attendance records will appear here once your admin starts marking attendance." />
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        <th className="px-5 py-3">Course</th>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.map((a, i) => (
                                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{a.course_title}</td>
                                            <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{new Date(a.date).toLocaleDateString()}</td>
                                            <td className="px-5 py-3">
                                                <span className={`font-medium capitalize ${STATUS_COLORS[a.status]}`}>
                                                    {a.status === 'present' ? '✓' : a.status === 'absent' ? '✗' : '⏰'} {a.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </main>
        </div>
    )
}