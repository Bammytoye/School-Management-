import { useState, useEffect } from 'react'
import toast from 'react-toastify'
import AdminLayout from '../../components/AdminLayout'
import EmptyState from '../../components/EmptyState'
import { TableSkeleton } from '../../components/Skeleton'
import { attendanceAPI } from '../../api/gradesAPI'
import { courseAPI } from '../../api/courseAPI'
import { enrolmentAPI } from '../../api/enrolmentAPI'

const STATUS_STYLES = {
    present: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
    absent: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
    late: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
}

export default function Attendance() {
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSC] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [enrolments, setEnrolments] = useState([])
    const [records, setRecords] = useState({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        courseAPI.getAll({ limit: 100 }).then((r) => setCourses(r.data.courses))
    }, [])

    useEffect(() => {
        if (!selectedCourse) return
        setLoading(true)
        Promise.all([
            enrolmentAPI.getAll(),
            attendanceAPI.getAll({ course_id: selectedCourse, date }),
        ]).then(([e, a]) => {
            const enrolled = e.data.enrolments.filter((en) => String(en.course_id) === String(selectedCourse))
            setEnrolments(enrolled)
            const rec = {}
            enrolled.forEach((en) => { rec[en.student_id] = 'present' })
            a.data.attendance.forEach((at) => { rec[at.user_id] = at.status })
            setRecords(rec)
        }).finally(() => setLoading(false))
    }, [selectedCourse, date])

    const toggle = (userId, status) => setRecords((r) => ({ ...r, [userId]: status }))

    const handleSave = async () => {
        if (!selectedCourse) return
        setSaving(true)
        try {
            const recordsArr = Object.entries(records).map(([user_id, status]) => ({ user_id: parseInt(user_id), status }))
            await attendanceAPI.mark({ course_id: parseInt(selectedCourse), date, records: recordsArr })
            toast.success('Attendance saved!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving attendance.')
        } finally { setSaving(false) }
    }

    const summary = Object.values(records)
    const presentCount = summary.filter((s) => s === 'present').length
    const absentCount = summary.filter((s) => s === 'absent').length
    const lateCount = summary.filter((s) => s === 'late').length

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Attendance</h1>

            <div className="card mb-6 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                    <select className="input w-64" value={selectedCourse} onChange={(e) => setSC(e.target.value)}>
                        <option value="">— Select course —</option>
                        {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>

            {selectedCourse && (
                <>
                    {enrolments.length > 0 && (
                        <div className="flex gap-3 mb-4 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">✓ Present: {presentCount}</span>
                            <span className="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">✗ Absent: {absentCount}</span>
                            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium">⏰ Late: {lateCount}</span>
                        </div>
                    )}

                    <div className="card overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                                    <th className="pb-3 pr-4">Student</th>
                                    <th className="pb-3 pr-4">Email</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <TableSkeleton rows={5} cols={3} />
                            ) : (
                                <tbody>
                                    {enrolments.map((en) => (
                                        <tr key={en.id} className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-100">{en.student_name}</td>
                                            <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{en.email}</td>
                                            <td className="py-3">
                                                <div className="flex gap-2">
                                                    {['present', 'absent', 'late'].map((s) => (
                                                        <button key={s} onClick={() => toggle(en.student_id, s)}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all ${records[en.student_id] === s
                                                                    ? STATUS_STYLES[s]
                                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                }`}>
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>

                        {!loading && enrolments.length === 0 && (
                            <EmptyState type="attendance" title="No students enrolled" description="Enrol students into this course first." />
                        )}

                        {!loading && enrolments.length > 0 && (
                            <div className="mt-4 flex justify-end">
                                <button onClick={handleSave} disabled={saving} className="btn-primary">
                                    {saving ? 'Saving...' : '💾 Save Attendance'}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {!selectedCourse && (
                <div className="card">
                    <EmptyState type="attendance" title="Select a course" description="Choose a course and date above to mark attendance." />
                </div>
            )}
        </AdminLayout>
    )
}