import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { MdOutlineMenuBook } from 'react-icons/md'
import AdminLayout from '../../components/AdminLayout'
import ConfirmModal from '../../components/ConfirmModal'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import EmptyState from '../../components/EmptyState'
import { TableSkeleton } from '../../components/Skeleton'
import { courseAPI } from '../../API/courseAPI'
import { useNavigate } from 'react-router-dom'

const EMPTY = { title: '', description: '' }

export default function Courses() {
    const navigate = useNavigate()

    const [data, setData] = useState({ courses: [], total: 0, totalPages: 1 })
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState('')

    const fetchCourses = useCallback(async () => {
        setLoading(true)
        try {
            const res = await courseAPI.getAll({ page, search })
            setData(res.data)
        } catch {
            toast.error('Failed to load courses.')
        } finally { setLoading(false) }
    }, [page, search])

    useEffect(() => { fetchCourses() }, [fetchCourses])

    const openAdd = () => { setForm(EMPTY); setError(''); setModal('add') }
    const openEdit = (course) => { setForm({ title: course.title, description: course.description || '' }); setSelected(course); setError(''); setModal('edit') }
    const closeModal = () => { setModal(null); setSelected(null) }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleAdd = async (e) => {
        e.preventDefault(); setError('')
        try {
            await courseAPI.create(form)
            toast.success('Course created!')
            closeModal(); fetchCourses()
        } catch (err) {
            const msg = err.response?.data?.message || 'Error creating course.'
            setError(msg); toast.error(msg)
        }
    }

    const handleEdit = async (e) => {
        e.preventDefault(); setError('')
        try {
            await courseAPI.update(selected.id, form)
            toast.success('Course updated!')
            closeModal(); fetchCourses()
        } catch (err) {
            const msg = err.response?.data?.message || 'Error updating course.'
            setError(msg); toast.error(msg)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await courseAPI.delete(confirmDelete.id)
            toast.success('Course deleted.')
            setConfirmDelete(null); fetchCourses()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error deleting.')
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
                    <MdOutlineMenuBook className="text-blue-500 text-2xl sm:text-3xl" />
                    Courses
                </h1>
                <button onClick={openAdd} className="btn-primary flex items-center gap-1.5 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2.5">
                    <FiPlus className="text-base sm:text-lg flex-shrink-0" />
                    <span className="hidden sm:inline">Add Course</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            <div className="card">
                {/* Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <SearchBar
                        onSearch={(s) => { setSearch(s); setPage(1) }}
                        placeholder="Search courses..."
                    />
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {data.total} total
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm min-w-[520px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4">Title</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 hidden md:table-cell">Description</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 hidden lg:table-cell">Created By</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 hidden sm:table-cell">Date</th>
                                <th className="pb-2 sm:pb-3">Actions</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <TableSkeleton rows={6} cols={5} />
                        ) : (
                            <tbody>
                                {data.courses.map((c) => (
                                    <tr key={c.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 font-medium text-gray-800 dark:text-gray-100">
                                            <div className="truncate max-w-[140px] sm:max-w-[180px] md:max-w-xs">
                                                {c.title}
                                            </div>
                                            {/* Description shown under title on mobile */}
                                            <div className="md:hidden text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[140px] sm:max-w-[200px]">
                                                {c.description || '—'}
                                            </div>
                                        </td>
                                        <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-500 dark:text-gray-400 max-w-xs truncate hidden md:table-cell">
                                            {c.description || '—'}
                                        </td>
                                        <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                                            {c.created_by_name || '—'}
                                        </td>
                                        <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:table-cell">
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-2.5 sm:py-3">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => openEdit(c)}
                                                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium transition-colors"
                                                >
                                                    <FiEdit2 className="text-sm" />
                                                    <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(c)}
                                                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                                                >
                                                    <FiTrash2 className="text-sm" />
                                                    <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>

                    {!loading && data.courses.length === 0 && (
                        <EmptyState
                            type="courses"
                            title="No courses found"
                            description={search ? `No results for "${search}".` : 'Add your first course to get started.'}
                            action={!search ? openAdd : null}
                            actionLabel="Add Course"
                        />
                    )}
                </div>

                <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>

            {/* Add Modal */}
            <Modal isOpen={modal === 'add'} onClose={closeModal} title="Add New Course">
                <form onSubmit={handleAdd} className="space-y-3">
                    {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input name="title" required value={form.title} onChange={handleChange} className="input mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="input mt-1 h-24 resize-none" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-primary flex-1">Create</button>
                        <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={modal === 'edit'} onClose={closeModal} title={`Edit — ${selected?.title}`}>
                <form onSubmit={handleEdit} className="space-y-3">
                    {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input name="title" required value={form.title} onChange={handleChange} className="input mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="input mt-1 h-24 resize-none" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-primary flex-1">Save</button>
                        <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirm */}
            <ConfirmModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Course"
                message={`Delete "${confirmDelete?.title}"? All enrolments for this course will also be removed.`}
                confirmLabel="Delete Course"
            />
        </AdminLayout>
    )
}