import { useState, useEffect, useCallback } from 'react'
import toast from 'react-toastify'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import ConfirmModal from '../../components/ConfirmModal'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import EmptyState from '../../components/EmptyState'
import { TableSkeleton } from '../../components/Skeleton'
import { userAPI } from '../../api/userAPI'

const EMPTY = { name: '', email: '', password: '', role: 'student' }

export default function Students() {
    const [data, setData] = useState({ users: [], total: 0, totalPages: 1 })
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(null) // 'add' | 'edit'
    const [confirmDelete, setConfirmDelete] = useState(null) // user to delete
    const [deleting, setDeleting] = useState(false)
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState('')

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await userAPI.getAll({ page, search, role: 'student' })
            setData(res.data)
        } catch (err) {
            toast.error('Failed to load students.')
        } finally {
            setLoading(false)
        }
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
        } finally {
            setDeleting(false)
        }
    }

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Students</h1>
                <button onClick={openAdd} className="btn-primary">➕ Add Student</button>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <SearchBar onSearch={(v) => { setSearch(v); setPage(1) }} placeholder="Search students..." />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{data.total} total</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                                <th className="pb-3 pr-4">Name</th>
                                <th className="pb-3 pr-4">Email</th>
                                <th className="pb-3 pr-4">Role</th>
                                <th className="pb-3 pr-4">Joined</th>
                                <th className="pb-3">Actions</th>
                            </tr>
                        </thead>

                        {loading ? (
                            <TableSkeleton rows={6} cols={5} />
                        ) : (
                            <tbody>
                                {data.users.map((u) => (
                                    <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-100">{u.name}</td>
                                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td className="py-3 flex gap-3">
                                            <button onClick={() => openEdit(u)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium">Edit</button>
                                            <button onClick={() => setConfirmDelete(u)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
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
            <Modal isOpen={modal === 'add'} onClose={closeModal} title="Add New Student">
                <form onSubmit={handleAdd} className="space-y-3">
                    {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label><input name="name" required value={form.name} onChange={handleChange} className="input mt-1" /></div>
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><input name="email" type="email" required value={form.email} onChange={handleChange} className="input mt-1" /></div>
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label><input name="password" type="password" required value={form.password} onChange={handleChange} className="input mt-1" /></div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select name="role" value={form.role} onChange={handleChange} className="input mt-1">
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-primary flex-1">Create</button>
                        <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={modal === 'edit'} onClose={closeModal} title={`Edit — ${selected?.name}`}>
                <form onSubmit={handleEdit} className="space-y-3">
                    {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label><input name="name" required value={form.name} onChange={handleChange} className="input mt-1" /></div>
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><input name="email" type="email" required value={form.email} onChange={handleChange} className="input mt-1" /></div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select name="role" value={form.role} onChange={handleChange} className="input mt-1">
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-primary flex-1">Save</button>
                        <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirm Modal */}
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