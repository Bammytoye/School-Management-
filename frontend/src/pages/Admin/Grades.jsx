import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiEdit2, FiSave, FiX } from 'react-icons/fi'
import { MdOutlineGrade } from 'react-icons/md'
import { FaChalkboardTeacher } from 'react-icons/fa'
import AdminLayout from '../../components/AdminLayout'
import ConfirmModal from '../../components/ConfirmModal'
import EmptyState from '../../components/EmptyState'
import { TableSkeleton } from '../../components/Skeleton'
import { gradesAPI } from '../../API/gradesAPI'
import { courseAPI } from '../../API/courseAPI'
import { enrolmentAPI } from '../../API/enrolmentAPI'
import { useNavigate } from 'react-router-dom'

const GRADE_COLORS = {
    A: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    C: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    D: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    F: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function Grades() {
    const navigate = useNavigate()
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
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving grade.')
        }
    }

    return (
        <AdminLayout>
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3 sm:mb-4"
            >
                <FiArrowLeft className="flex-shrink-0" />
                Back
            </button>

            {/* Page title */}
            <h1 className="flex items-center gap-2 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <MdOutlineGrade className="text-blue-500 flex-shrink-0" />
                Grades
            </h1>

            {/* Course selector */}
            <div className="card mb-4 sm:mb-5 md:mb-6">
                <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    <FaChalkboardTeacher className="text-blue-500 flex-shrink-0" />
                    Select Course
                </label>
                <select
                    className="input
                    w-full
                    sm:w-3/4
                    md:w-1/2
                    lg:w-2/5
                    xl:w-1/3
                    text-sm sm:text-base"
                    value={selectedCourse}
                    onChange={(e) => setSC(e.target.value)}
                >
                    <option value=""> Choose a course </option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
            </div>

            {/* Grades table */}
            {selectedCourse && (
                <div className="card overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm min-w-[540px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap">Student</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap hidden sm:table-cell">Email</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap">Score</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap">Grade</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap hidden md:table-cell">Remarks</th>
                                <th className="pb-2 sm:pb-3 whitespace-nowrap">Action</th>
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
                                            {/* Student name + email on mobile */}
                                            <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                                <div>{en.student_name}</div>
                                                <div className="sm:hidden text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-normal">
                                                    {en.email}
                                                </div>
                                            </td>
                                            {/* Email — hidden on mobile */}
                                            <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                                {en.email}
                                            </td>
                                            {/* Score */}
                                            <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                {g ? `${g.score}%` : <span className="text-gray-400">—</span>}
                                            </td>
                                            {/* Grade badge */}
                                            <td className="py-2.5 sm:py-3 pr-3 sm:pr-4">
                                                {g ? (
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${GRADE_COLORS[g.grade] || ''}`}>
                                                        {g.grade}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-600 text-xs">Not graded</span>
                                                )}
                                            </td>
                                            {/* Remarks — hidden on mobile */}
                                            <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-500 dark:text-gray-400 max-w-[140px] truncate hidden md:table-cell">
                                                {g?.remarks || '—'}
                                            </td>
                                            {/* Action */}
                                            <td className="py-2.5 sm:py-3">
                                                <button
                                                    onClick={() => openGrade(en)}
                                                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium transition-colors"
                                                >
                                                    <FiEdit2 className="flex-shrink-0" />
                                                    <span className="hidden sm:inline">{g ? 'Edit' : 'Set Grade'}</span>
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
                    <EmptyState
                        type="grades"
                        title="Select a course"
                        description="Choose a course above to start grading students."
                    />
                </div>
            )}

            {/* Grade modal */}
            <ConfirmModal
                isOpen={!!modal}
                onClose={() => setModal(null)}
                title={`Grade — ${modal?.student_name}`}
            >
                <form onSubmit={handleSave} className="space-y-3 sm:space-y-4">
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            Score (0–100)
                        </label>
                        <input
                            type="number" min="0" max="100" step="0.5" required
                            className="input mt-1 text-sm sm:text-base"
                            value={form.score}
                            onChange={(e) => setForm({ ...form, score: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            Remarks (optional)
                        </label>
                        <textarea
                            className="input mt-1 h-20 resize-none text-sm sm:text-base"
                            value={form.remarks}
                            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm sm:text-base">
                            <FiSave className="flex-shrink-0" />
                            Save Grade
                        </button>
                        <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm sm:text-base">
                            <FiX className="flex-shrink-0" />
                            Cancel
                        </button>
                    </div>
                </form>
            </ConfirmModal>
        </AdminLayout>
    )
}