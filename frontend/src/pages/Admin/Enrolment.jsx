import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import { enrolmentAPI } from '../../api/enrolmentAPI';
import { userAPI } from '../../api/userAPI';
import { courseAPI } from '../../api/courseAPI';

export default function Enrolments() {
    const [enrolments, setEnrolments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ user_id: '', course_id: '' });
    const [error, setError] = useState('');

    const fetch = async () => {
        const [e, u, c] = await Promise.all([
            enrolmentAPI.getAll(),
            userAPI.getAll({ role: 'student', limit: 100 }),
            courseAPI.getAll({ limit: 100 }),
        ]);
        setEnrolments(e.data.enrolments);
        setStudents(u.data.users);
        setCourses(c.data.courses);
    };

    useEffect(() => { fetch(); }, []);

    const handleEnrol = async (e) => {
        e.preventDefault(); setError('');
        try {
            await enrolmentAPI.enrol({ user_id: parseInt(form.user_id), course_id: parseInt(form.course_id) });
            setModal(false); setForm({ user_id: '', course_id: '' }); fetch();
        } catch (err) { setError(err.response?.data?.message || 'Error.'); }
    };

    const handleRemove = async (id) => {
        if (!window.confirm('Remove this enrolment?')) return;
        await enrolmentAPI.remove(id);
        fetch();
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Enrolments</h1>
                <button onClick={() => { setModal(true); setError(''); }} className="btn-primary">➕ Enrol Student</button>
            </div>

            <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-500 uppercase text-xs">
                            <th className="pb-3 pr-4">Student</th>
                            <th className="pb-3 pr-4">Email</th>
                            <th className="pb-3 pr-4">Course</th>
                            <th className="pb-3 pr-4">Enrolled On</th>
                            <th className="pb-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrolments.map((e) => (
                            <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 pr-4 font-medium text-gray-800">{e.student_name}</td>
                                <td className="py-3 pr-4 text-gray-500">{e.email}</td>
                                <td className="py-3 pr-4 text-gray-700">{e.course_title}</td>
                                <td className="py-3 pr-4 text-gray-500">{new Date(e.enrolled_at).toLocaleDateString()}</td>
                                <td className="py-3">
                                    <button onClick={() => handleRemove(e.id)} className="text-red-500 hover:underline text-xs font-medium">Remove</button>
                                </td>
                            </tr>
                        ))}
                        {enrolments.length === 0 && (
                            <tr><td colSpan={5} className="py-10 text-center text-gray-400">No enrolments yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modal} onClose={() => setModal(false)} title="Enrol Student in Course">
                <form onSubmit={handleEnrol} className="space-y-3">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Select Student</label>
                        <select required value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} className="input mt-1">
                            <option value="">— Choose student —</option>
                            {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Select Course</label>
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
        </AdminLayout>
    );
}