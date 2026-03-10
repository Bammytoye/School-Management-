import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiMail, FiLock, FiShield, FiArrowLeft } from 'react-icons/fi'
import { MdOutlinePeople } from 'react-icons/md'
import AdminLayout from '../../components/AdminLayout'
import ConfirmModal from '../../components/ConfirmModal'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import EmptyState from '../../components/EmptyState'
import { TableSkeleton } from '../../components/Skeleton'
import { userAPI } from '../../API/userAPI'
import { useNavigate } from 'react-router-dom'

const EMPTY = { name: '', email: '', password: '', role: 'student' }

export default function Students() {
    const navigate = useNavigate()

    const [data, setData] = useState({ users: [], total: 0, totalPages: 1 })
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState('')

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await userAPI.getAll({ page, search, role: 'student' })
            setData(res.data)
        } catch {
            toast.error('Failed to load students.')
        } finally { setLoading(false) }
    }, [page, search])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const openAdd = () => { setForm(EMPTY); setError(''); setModal('add') }
    const openEdit = (user) => { setForm({ name: user.name, email: user.email, role: user.role, password: '' }); setSelected(user); setError(''); setModal('edit') }
    const closeModal = () => { setModal(null); setSelected(null) }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleAdd = async (e) => {
        e.preventDefault(); setError('')
        try {
            await userAPI.create(form)
            toast.success('Student created!')
            closeModal(); fetchUsers()
        } catch (err) {
            const msg = err.response?.data?.message || 'Error creating student.'
            setError(msg); toast.error(msg)
        }
    }

    const handleEdit = async (e) => {
        e.preventDefault(); setError('')
        try {
            await userAPI.update(selected.id, { name: form.name, email: form.email, role: form.role })
            toast.success('Student updated!')
            closeModal(); fetchUsers()
        } catch (err) {
            const msg = err.response?.data?.message || 'Error updating student.'
            setError(msg); toast.error(msg)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await userAPI.delete(confirmDelete.id)
            toast.success('Student deleted.')
            setConfirmDelete(null); fetchUsers()
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
                    <MdOutlinePeople className="text-blue-500 flex-shrink-0" />
                    Students
                </h1>
                <button
                    onClick={openAdd}
                    className="btn-primary flex items-center gap-1.5 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2.5"
                >
                    <FiPlus className="flex-shrink-0" />
                    <span className="hidden sm:inline">Add Student</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            <div className="card">
                {/* Search + total */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
                    <SearchBar
                        onSearch={(v) => { setSearch(v); setPage(1) }}
                        placeholder="Search students..."
                    />
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {data.total} total
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm min-w-[480px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap">Name</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap hidden sm:table-cell">Email</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap hidden md:table-cell">Role</th>
                                <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap hidden lg:table-cell">Joined</th>
                                <th className="pb-2 sm:pb-3 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>

                        {loading ? (
                            <TableSkeleton rows={6} cols={5} />
                        ) : (
                            <tbody>
                                {data.users.map((u) => (
                                    <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        {/* Name + email/role subtitle on mobile */}
                                        <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                            <div>{u.name}</div>
                                            <div className="sm:hidden text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-normal">
                                                {u.email}
                                            </div>
                                        </td>
                                        {/* Email — sm+ */}
                                        <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                                            {u.email}
                                        </td>
                                        {/* Role badge — md+ */}
                                        <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 hidden md:table-cell">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin'
                                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        {/* Joined — lg+ */}
                                        <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap hidden lg:table-cell">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        {/* Actions */}
                                        <td className="py-2.5 sm:py-3">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => openEdit(u)}
                                                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium transition-colors"
                                                >
                                                    <FiEdit2 className="flex-shrink-0" />
                                                    <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(u)}
                                                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                                                >
                                                    <FiTrash2 className="flex-shrink-0" />
                                                    <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>

                    {!loading && data.users.length === 0 && (
                        <EmptyState
                            type="students"
                            title="No students found"
                            description={search ? `No results for "${search}". Try a different search.` : 'Add your first student to get started.'}
                            action={!search ? openAdd : null}
                            actionLabel="Add Student"
                        />
                    )}
                </div>

                <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>

            {/* Add Modal */}
            <ConfirmModal isOpen={modal === 'add'} onClose={closeModal} title="Add New Student">
                <form onSubmit={handleAdd} className="space-y-3 sm:space-y-4">
                    {error && <p className="text-red-500 text-xs sm:text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiUser className="text-gray-400 flex-shrink-0" /> Name
                        </label>
                        <input name="name" required value={form.name} onChange={handleChange} className="input text-sm w-full max-w-xs" />
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiMail className="text-gray-400 flex-shrink-0" /> Email
                        </label>
                        <input name="email" type="email" required value={form.email} onChange={handleChange} className="input text-sm w-full max-w-xs" />
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiLock className="text-gray-400 flex-shrink-0" /> Password
                        </label>
                        <input name="password" type="password" required value={form.password} onChange={handleChange} className="input text-sm w-full max-w-xs" />
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiShield className="text-gray-400 flex-shrink-0" /> Role
                        </label>
                        <select name="role" value={form.role} onChange={handleChange} className="input text-sm w-full max-w-xs">
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm sm:text-base">
                            <FiPlus className="flex-shrink-0" /> Create
                        </button>
                        <button type="button" onClick={closeModal} className="btn-secondary flex-1 text-sm sm:text-base">
                            Cancel
                        </button>
                    </div>
                </form>
            </ConfirmModal>

            {/* Edit Modal */}
            <ConfirmModal isOpen={modal === 'edit'} onClose={closeModal} title={`Edit — ${selected?.name}`}>
                <form onSubmit={handleEdit} className="space-y-3 sm:space-y-4">
                    {error && <p className="text-red-500 text-xs sm:text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiUser className="text-gray-400 flex-shrink-0" /> Name
                        </label>
                        <input name="name" required value={form.name} onChange={handleChange} className="input text-sm w-full max-w-xs" />
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiMail className="text-gray-400 flex-shrink-0" /> Email
                        </label>
                        <input name="email" type="email" required value={form.email} onChange={handleChange} className="input text-sm w-full max-w-xs" />
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiShield className="text-gray-400 flex-shrink-0" /> Role
                        </label>
                        <select name="role" value={form.role} onChange={handleChange} className="input text-sm w-full max-w-xs">
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm sm:text-base">
                            <FiEdit2 className="flex-shrink-0" /> Save
                        </button>
                        <button type="button" onClick={closeModal} className="btn-secondary flex-1 text-sm sm:text-base">
                            Cancel
                        </button>
                    </div>
                </form>
            </ConfirmModal>

            {/* Delete Confirm */}
            <ConfirmModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Student"
                message={`Are you sure you want to delete ${confirmDelete?.name}? This will also remove all their enrolments and grades.`}
                confirmLabel="Delete Student"
            />
        </AdminLayout>
    )
}