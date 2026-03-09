import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import { TableSkeleton } from '../../components/Skeleton'
import { gradesAPI } from '../../api/gradesAPI'
import { courseAPI } from '../../api/courseAPI'
import { enrolmentAPI } from '../../api/enrolmentAPI'

const GRADE_COLORS = {
    A: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    C: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    D: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    F: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function Grades() {
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSC] = useState('')
    const [enrolments, setEnrolments] = useState([])
    const [grades, setGrades] = useState([])
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(null)
    const [form, setForm] = useState({ user_id: '', course_id: '', score: '', remarks: '' })

    useEffect(() => {
        courseAPI.getAll({ limit: 100 }).then((r) => setCourses(r.data.courses))
    }, [])

    useEffect(() => {
        if (!selectedCourse) return
        setLoading(true)
        Promise.all([
            enrolmentAPI.getAll(),
            gradesAPI.getAll({ course_id: selectedCourse }),
        ]).then(([e, g]) => {
            setEnrolments(e.data.enrolments.filter((en) => String(en.course_id) === String(selectedCourse)))
            setGrades(g.data.grades)
        }).finally(() => setLoading(false))
    }, [selectedCourse])

    const getGradeFor = (user_id) => grades.find((g) => String(g.user_id) === String(user_id))

    const openGrade = (student) => {
        const existing = getGradeFor(student.student_id)
        setForm({ user_id: student.student_id, course_id: selectedCourse, score: existing?.score || '', remarks: existing?.remarks || '' })
        setModal(student)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        try {
            await gradesAPI.setGrade({ ...form, score: parseFloat(form.score) })
            toast.success('Grade saved!')
            setModal(null)
            gradesAPI.getAll({ course_id: selectedCourse }).then((r) => setGrades(r.data.grades))
        } catch (err) { toast.error(err.response?.data?.message || 'Error saving grade.') }
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Grades</h1>

            <div className="card mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Course</label>
                <select className="input w-72" value={selectedCourse} onChange={(e) => setSC(e.target.value)}>
                    <option value="">— Choose a course —</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
            </div>

            {selectedCourse && (
                <div className="card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                                <th className="pb-3 pr-4">Student</th>
                                <th className="pb-3 pr-4">Email</th>
                                <th className="pb-3 pr-4">Score</th>
                                <th className="pb-3 pr-4">Grade</th>
                                <th className="pb-3 pr-4">Remarks</th>
                                <th className="pb-3">Action</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <TableSkeleton rows={5} cols={6} />
                        ) : (
                            <tbody>
                                {enrolments.map((en) => {
                                    const g = getGradeFor(en.student_id)
                                    return (
                                        <tr key={en.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-100">{en.student_name}</td>
                                            <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{en.email}</td>
                                            <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">{g ? `${g.score}%` : <span className="text-gray-400">—</span>}</td>
                                            <td className="py-3 pr-4">
                                                {g
                                                    ? <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${GRADE_COLORS[g.grade] || ''}`}>{g.grade}</span>
                                                    : <span className="text-gray-400 dark:text-gray-600 text-xs">Not graded</span>}
                                            </td>
                                            <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{g?.remarks || '—'}</td>
                                            <td className="py-3">
                                                <button onClick={() => openGrade(en)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium">
                                                    {g ? 'Edit' : 'Set Grade'}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        )}
                    </table>

                    {!loading && enrolments.length === 0 && (
                        <EmptyState
                            type="grades"
                            title="No students enrolled"
                            description="Enrol students into this course first before grading them."
                        />
                    )}
                </div>
            )}

            {!selectedCourse && (
                <div className="card">
                    <EmptyState type="grades" title="Select a course" description="Choose a course above to start grading students." />
                </div>
            )}

            <Modal isOpen={!!modal} onClose={() => setModal(null)} title={`Grade — ${modal?.student_name}`}>
                <form onSubmit={handleSave} className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Score (0–100)</label>
                        <input type="number" min="0" max="100" step="0.5" required
                            className="input mt-1" value={form.score}
                            onChange={(e) => setForm({ ...form, score: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Remarks (optional)</label>
                        <textarea className="input mt-1 h-20 resize-none" value={form.remarks}
                            onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-primary flex-1">Save Grade</button>
                        <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    )
}