import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiPlus, FiTrash2, FiUserCheck } from 'react-icons/fi'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { MdOutlinePersonAdd } from 'react-icons/md'
import AdminLayout from '../../components/AdminLayout'
import ConfirmModal from '../../components/ConfirmModal'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import { TableSkeleton } from '../../components/Skeleton'
import { enrolmentAPI } from '../../API/enrolmentAPI'
import { userAPI } from '../../API/userAPI'
import { courseAPI } from '../../API/courseAPI'
import { useNavigate } from 'react-router-dom'

export default function Enrolments() {
    const navigate = useNavigate()

    const [enrolments, setEnrolments] = useState([])
    const [students, setStudents] = useState([])
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [form, setForm] = useState({ user_id: '', course_id: '' })
    const [error, setError] = useState('')

    const loadData = async () => {
        setLoading(true)
        try {
            const [e, u, c] = await Promise.all([
                enrolmentAPI.getAll(),
                userAPI.getAll({ role: 'student', limit: 100 }),
                courseAPI.getAll({ limit: 100 }),
            ])
            setEnrolments(e.data.enrolments)
            setStudents(u.data.users)
            setCourses(c.data.courses)
        } catch (err) {
            toast.error('Failed to load enrolments. Please refresh.')
            console.error('Enrolments load error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const handleEnrol = async (e) => {
        e.preventDefault(); setError('')
        try {
            await enrolmentAPI.enrol({ user_id: parseInt(form.user_id), course_id: parseInt(form.course_id) })
            toast.success('Student enrolled successfully!')
            setModal(false); setForm({ user_id: '', course_id: '' }); loadData()
        } catch (err) {
            const msg = err.response?.data?.message || 'Error enrolling student.'
            setError(msg); toast.error(msg)
        }
    }

    const handleRemove = async () => {
        setDeleting(true)
        try {
            await enrolmentAPI.remove(confirmDelete.id)
            toast.success('Enrolment removed.')
            setConfirmDelete(null); loadData()
        } catch {
            toast.error('Failed to remove enrolment.')
        } finally { setDeleting(false) }
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
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <h1 className="flex items-center gap-2 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                    <FiUserCheck className="text-blue-500 flex-shrink-0" />
                    Enrolments
                </h1>
                <button
                    onClick={() => { setModal(true); setError('') }}
                    className="btn-primary flex items-center gap-1.5 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2.5"
                >
                    <FiPlus className="flex-shrink-0" />
                    <span className="hidden sm:inline">Enrol Student</span>
                    <span className="sm:hidden">Enrol</span>
                </button>
            </div>

            {/* Table */}
            <div className="card overflow-x-auto">
                <table className="w-full text-xs sm:text-sm min-w-[480px]">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                            <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap">Student</th>
                            <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap hidden sm:table-cell">Email</th>
                            <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap">Course</th>
                            <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap hidden md:table-cell">Enrolled On</th>
                            <th className="pb-2 sm:pb-3 whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <TableSkeleton rows={6} cols={5} />
                    ) : (
                        <tbody>
                            {enrolments.map((en) => (
                                <tr key={en.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    {/* Student + email subtitle on mobile */}
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
                                    {/* Course */}
                                    <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-700 dark:text-gray-300 max-w-[120px] sm:max-w-[180px] truncate">
                                        {en.course_title}
                                    </td>
                                    {/* Enrolled date — hidden on mobile */}
                                    <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap hidden md:table-cell">
                                        {new Date(en.enrolled_at).toLocaleDateString()}
                                    </td>
                                    {/* Remove */}
                                    <td className="py-2.5 sm:py-3">
                                        <button
                                            onClick={() => setConfirmDelete(en)}
                                            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                                        >
                                            <FiTrash2 className="flex-shrink-0" />
                                            <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>

                {!loading && enrolments.length === 0 && (
                    <EmptyState
                        type="enrolments"
                        title="No enrolments yet"
                        description="Enrol students into courses to get started."
                        action={() => { setModal(true); setError('') }}
                        actionLabel="Enrol Student"
                    />
                )}
            </div>

            {/* Enrol Modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title="Enrol Student in Course">
                <form onSubmit={handleEnrol} className="space-y-3 sm:space-y-4">
                    {error && (
                        <p className="text-red-500 text-xs sm:text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                            {error}
                        </p>
                    )}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <MdOutlinePersonAdd className="text-blue-500 flex-shrink-0" />
                            Select Student
                        </label>
                        <select
                            required
                            value={form.user_id}
                            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                            className="input mt-1 text-sm w-full max-w-xs"
                        >
                            <option value=""> Choose Student </option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FaChalkboardTeacher className="text-blue-500 flex-shrink-0" />
                            Select Course
                        </label>
                        <select
                            required
                            value={form.course_id}
                            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                            className="input mt-1 text-sm w-full max-w-xs"
                        >
                            <option value="">Choose Course</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm sm:text-base">
                            <FiUserCheck className="flex-shrink-0" />
                            Enrol
                        </button>
                        <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm sm:text-base">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Remove Confirm */}
            <ConfirmModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleRemove}
                loading={deleting}
                title="Remove Enrolment"
                message={`Remove ${confirmDelete?.student_name} from "${confirmDelete?.course_title}"?`}
                confirmLabel="Remove"
            />
        </AdminLayout>
    )
}