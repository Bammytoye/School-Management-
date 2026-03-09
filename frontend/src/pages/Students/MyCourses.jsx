import { useState, useEffect } from 'react'
import Navbar from '../../components/NavBar'
import { enrolmentAPI } from '../../API/enrolmentAPI'
import { gradesAPI, attendanceAPI } from '../../API/gradesAPI'
import { useAuth } from '../../context/AuthContext'

const GRADE_COLORS = { 
    A: 'bg-green-100 text-green-700', 
    B: 'bg-blue-100 text-blue-700', 
    C: 'bg-yellow-100 text-yellow-700', 
    D: 'bg-orange-100 text-orange-700', 
    F: 'bg-red-100 text-red-700' 
}

const STATUS_COLORS = { 
    present: 'text-green-600', 
    absent: 'text-red-500', 
    late: 'text-yellow-600' 

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
    }, []);

    const presentPct = attendance.length
        ? Math.round((attendance.filter((a) => a.status === 'present').length / attendance.length) * 100)
        : null

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto p-6">
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Learning</h1>
                        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}!</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center">
                            <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
                            <p className="text-xs text-gray-500">Courses</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center">
                            <p className="text-2xl font-bold text-green-600">{grades.length}</p>
                            <p className="text-xs text-gray-500">Graded</p>
                        </div>
                        {presentPct !== null && (
                            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center">
                                <p className="text-2xl font-bold text-purple-600">{presentPct}%</p>
                                <p className="text-xs text-gray-500">Attendance</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
                    {[['courses', '📚 Courses'], ['grades', '📊 Grades'], ['attendance', '📋 Attendance']].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
                            {label}
                        </button>
                    ))}
                </div>

                {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
                    <>
                        {tab === 'courses' && (
                            courses.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                                    <div className="text-5xl mb-4">📚</div>
                                    <p className="text-gray-500">No courses yet. Contact your admin.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {courses.map((c) => {
                                        const grade = grades.find((g) => g.course_title === c.title);
                                        return (
                                            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📖</div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">{c.title}</h3>
                                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description || 'No description.'}</p>
                                                            <p className="text-xs text-gray-400 mt-2">Enrolled: {new Date(c.enrolled_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    {grade && <span className={`px-2 py-0.5 rounded-full text-sm font-bold flex-shrink-0 ${GRADE_COLORS[grade.grade] || ''}`}>{grade.grade}</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}

                        {tab === 'grades' && (
                            grades.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center"><div className="text-5xl mb-4">📊</div><p className="text-gray-500">No grades yet.</p></div>
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead><tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-500 uppercase text-xs"><th className="px-5 py-3">Course</th><th className="px-5 py-3">Score</th><th className="px-5 py-3">Grade</th><th className="px-5 py-3">Remarks</th></tr></thead>
                                        <tbody>
                                            {grades.map((g, i) => (
                                                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="px-5 py-3 font-medium text-gray-800">{g.course_title}</td>
                                                    <td className="px-5 py-3 text-gray-700">{g.score}%</td>
                                                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${GRADE_COLORS[g.grade] || ''}`}>{g.grade}</span></td>
                                                    <td className="px-5 py-3 text-gray-500">{g.remarks || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}

                        {tab === 'attendance' && (
                            attendance.length === 0 ? (
                                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center"><div className="text-5xl mb-4">📋</div><p className="text-gray-500">No attendance records yet.</p></div>
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead><tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-500 uppercase text-xs"><th className="px-5 py-3">Course</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th></tr></thead>
                                        <tbody>
                                            {attendance.map((a, i) => (
                                                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="px-5 py-3 font-medium text-gray-800">{a.course_title}</td>
                                                    <td className="px-5 py-3 text-gray-600">{new Date(a.date).toLocaleDateString()}</td>
                                                    <td className="px-5 py-3"><span className={`font-medium capitalize ${STATUS_COLORS[a.status]}`}>{a.status === 'present' ? '✓' : a.status === 'absent' ? '✗' : '⏰'} {a.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}
                    </>
                )}
            </main>
        </div>
    );
}