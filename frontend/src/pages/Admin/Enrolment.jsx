import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import ConfirmModal from '../../components/ConfirmModal'
import EmptyState from '../../components/EmptyState'
import { TableSkeleton } from '../../components/Skeleton'
import { enrolmentAPI } from '../../api/enrolmentAPI'
import { userAPI } from '../../api/userAPI'
import { courseAPI } from '../../api/courseAPI'

export default function Enrolments() {
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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Enrolments</h1>
                <button onClick={() => { setModal(true); setError('') }} className="btn-primary">➕ Enrol Student</button>
            </div>

            <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                            <th className="pb-3 pr-4">Student</th>
                            <th className="pb-3 pr-4">Email</th>
                            <th className="pb-3 pr-4">Course</th>
                            <th className="pb-3 pr-4">Enrolled On</th>
                            <th className="pb-3">Action</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <TableSkeleton rows={6} cols={5} />
                    ) : (
                        <tbody>
                            {enrolments.map((en) => (
                                <tr key={en.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-100">{en.student_name}</td>
                                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{en.email}</td>
                                    <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">{en.course_title}</td>
                                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{new Date(en.enrolled_at).toLocaleDateString()}</td>
                                    <td className="py-3">
                                        <button onClick={() => setConfirmDelete(en)} className="text-red-500 hover:underline text-xs font-medium">Remove</button>
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
                <form onSubmit={handleEnrol} className="space-y-3">
                    {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Student</label>
                        <select required value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} className="input mt-1">
                            <option value="">— Choose student —</option>
                            {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Course</label>
                        <select required value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="input mt-1">
                            <option value="">— Choose course —</option>
                            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-primary flex-1">Enrol</button>
                        <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
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