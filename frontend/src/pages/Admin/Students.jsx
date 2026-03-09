import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import { userAPI } from '../../API/userAPI';
import { toast } from 'react-toastify'

const EMPTY = { name: '', email: '', password: '', role: 'student' };

export default function Students() {
    const [data, setData] = useState({ users: [], total: 0, totalPages: 1 });
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await userAPI.getAll({ page, search, role: 'student' });
            setData(res.data);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const openAdd = () => { setForm(EMPTY); setError(''); setModal('add'); };
    const openEdit = (user) => { setForm({ name: user.name, email: user.email, role: user.role, password: '' }); setSelected(user); setError(''); setModal('edit'); };
    const openDel = (user) => { setSelected(user); setModal('delete'); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = async (e) => {
        e.preventDefault(); setError('');
        try {
            await userAPI.create(form);
            toast.success('Student created successfully!');
            closeModal(); fetchUsers();
        } catch (err) {
            const msg = err.response?.data?.message || 'Error creating user.';
            setError(msg); toast.error(msg);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault(); setError('');
        try {
            await userAPI.update(selected.id, { name: form.name, email: form.email, role: form.role });
            toast.success('Student updated!');
            closeModal(); fetchUsers();
        } catch (err) {
            const msg = err.response?.data?.message || 'Error updating user.';
            setError(msg); toast.error(msg);
        }
    };

    const handleDelete = async () => {
        try {
            await userAPI.delete(selected.id);
            toast.success('Student deleted.');
            closeModal(); fetchUsers();
        } catch (err) { toast.error(err.response?.data?.message || 'Error deleting user.'); }
    }

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Students</h1>
                <button onClick={openAdd} className="btn-primary">➕ Add Student</button>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <SearchBar onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search students..." />
                    <p className="text-sm text-gray-500">{data.total} total</p>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-400">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-gray-500 uppercase text-xs">
                                    <th className="pb-3 pr-4">Name</th>
                                    <th className="pb-3 pr-4">Email</th>
                                    <th className="pb-3 pr-4">Role</th>
                                    <th className="pb-3 pr-4">Joined</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.users.map((u) => (
                                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 pr-4 font-medium text-gray-800">{u.name}</td>
                                        <td className="py-3 pr-4 text-gray-600">{u.email}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td className="py-3 flex gap-2">
                                            <button onClick={() => openEdit(u)} className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                            <button onClick={() => openDel(u)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {data.users.length === 0 && (
                                    <tr><td colSpan={5} className="py-10 text-center text-gray-400">No students found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>

            {/* Add Modal */}
            <Modal isOpen={modal === 'add'} onClose={closeModal} title="Add New Student">
                <form onSubmit={handleAdd} className="space-y-3">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div><label className="text-sm font-medium text-gray-700">Name</label><input name="name" required value={form.name} onChange={handleChange} className="input mt-1" /></div>
                    <div><label className="text-sm font-medium text-gray-700">Email</label><input name="email" type="email" required value={form.email} onChange={handleChange} className="input mt-1" /></div>
                    <div><label className="text-sm font-medium text-gray-700">Password</label><input name="password" type="password" required value={form.password} onChange={handleChange} className="input mt-1" /></div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Role</label>
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
            <Modal isOpen={modal === 'edit'} onClose={closeModal} title="Edit User">
                <form onSubmit={handleEdit} className="space-y-3">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div><label className="text-sm font-medium text-gray-700">Name</label><input name="name" required value={form.name} onChange={handleChange} className="input mt-1" /></div>
                    <div><label className="text-sm font-medium text-gray-700">Email</label><input name="email" type="email" required value={form.email} onChange={handleChange} className="input mt-1" /></div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Role</label>
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

            {/* Delete Modal */}
            <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Delete User">
                <p className="text-gray-600 mb-4">Are you sure you want to delete <strong>{selected?.name}</strong>? This cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
                    <button onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                </div>
            </Modal>
        </AdminLayout>
    );
}