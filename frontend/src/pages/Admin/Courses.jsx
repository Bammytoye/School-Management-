import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import { courseAPI } from '../../API/courseAPI';
import { toast } from 'react-toastify'

const EMPTY = { title: '', description: '' };

export default function Courses() {
    const [data, setData] = useState({ courses: [], total: 0, totalPages: 1 });
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState('');

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await courseAPI.getAll({ page, search });
            setData(res.data);
        } finally { setLoading(false); }
    }, [page, search]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    const openAdd = () => { setForm(EMPTY); setError(''); setModal('add'); };
    const openEdit = (course) => { setForm({ title: course.title, description: course.description || '' }); setSelected(course); setError(''); setModal('edit'); };
    const openDel = (course) => { setSelected(course); setModal('delete'); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = async (e) => {
        e.preventDefault(); setError('');
        try { await courseAPI.create(form); 
            toast.success('Course created!'); 
            closeModal(); 
            fetchCourses(); }
        catch (err) { 
            const msg = err.response?.data?.message || 'Error creating course.'; 
            setError(msg); toast.error(msg); 
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault(); setError('');
        try { await courseAPI.update(selected.id, form); 
            toast.success('Course updated!'); 
            closeModal(); 
            fetchCourses(); }
        catch (err) { 
            const msg = err.response?.data?.message || 'Error updating course.'; 
            setError(msg); toast.error(msg); 
        }
    };

    const handleDelete = async () => {
        try { await courseAPI.delete(selected.id); 
            toast.success('Course deleted.'); 
            closeModal(); 
            fetchCourses(); }
        catch (err) { 
            toast.error(err.response?.data?.message || 'Error.'); 
        }
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
                <button onClick={openAdd} className="btn-primary">➕ Add Course</button>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <SearchBar onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search courses..." />
                    <p className="text-sm text-gray-500">{data.total} total</p>
                </div>

                {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-gray-500 uppercase text-xs">
                                    <th className="pb-3 pr-4">Title</th>
                                    <th className="pb-3 pr-4">Description</th>
                                    <th className="pb-3 pr-4">Created By</th>
                                    <th className="pb-3 pr-4">Date</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.courses.map((c) => (
                                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 pr-4 font-medium text-gray-800">{c.title}</td>
                                        <td className="py-3 pr-4 text-gray-500 max-w-xs truncate">{c.description || '—'}</td>
                                        <td className="py-3 pr-4 text-gray-600">{c.created_by_name || '—'}</td>
                                        <td className="py-3 pr-4 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td className="py-3 flex gap-2">
                                            <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                            <button onClick={() => openDel(c)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {data.courses.length === 0 && (
                                    <tr><td colSpan={5} className="py-10 text-center text-gray-400">No courses found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>

            <Modal isOpen={modal === 'add'} onClose={closeModal} title="Add New Course">
                <form onSubmit={handleAdd} className="space-y-3">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div><label className="text-sm font-medium text-gray-700">Title</label><input name="title" required value={form.title} onChange={handleChange} className="input mt-1" /></div>
                    <div><label className="text-sm font-medium text-gray-700">Description</label><textarea name="description" value={form.description} onChange={handleChange} className="input mt-1 h-24 resize-none" /></div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-primary flex-1">Create</button>
                        <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={modal === 'edit'} onClose={closeModal} title="Edit Course">
                <form onSubmit={handleEdit} className="space-y-3">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div><label className="text-sm font-medium text-gray-700">Title</label><input name="title" required value={form.title} onChange={handleChange} className="input mt-1" /></div>
                    <div><label className="text-sm font-medium text-gray-700">Description</label><textarea name="description" value={form.description} onChange={handleChange} className="input mt-1 h-24 resize-none" /></div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-primary flex-1">Save</button>
                        <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Delete Course">
                <p className="text-gray-600 mb-4">Delete <strong>{selected?.title}</strong>? All enrolments for this course will also be removed.</p>
                <div className="flex gap-3">
                    <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
                    <button onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                </div>
            </Modal>
        </AdminLayout>
    );
}