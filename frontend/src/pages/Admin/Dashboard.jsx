import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { enrolmentAPI } from '../../api/enrolmentAPI';

const StatCard = ({ icon, label, value, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-800">{value ?? '—'}</p>
        </div>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        enrolmentAPI.getStats().then((res) => setStats(res.data.stats));
    }, []);

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon="👥" label="Total Students" value={stats?.total_students} color="bg-blue-100" />
                <StatCard icon="📚" label="Total Courses" value={stats?.total_courses} color="bg-green-100" />
                <StatCard icon="📋" label="Enrolments" value={stats?.total_enrolments} color="bg-purple-100" />
                <StatCard icon="👑" label="Admins" value={stats?.total_admins} color="bg-orange-100" />
            </div>
            <div className="card">
                <h2 className="font-semibold text-gray-700 mb-2">Quick Actions</h2>
                <div className="flex flex-wrap gap-3 mt-3">
                    <a href="/admin/students" className="btn-primary text-sm">➕ Add Student</a>
                    <a href="/admin/courses" className="btn-primary text-sm">📚 Add Course</a>
                    <a href="/admin/enrolments" className="btn-primary text-sm">📋 Manage Enrolments</a>
                </div>
            </div>
        </AdminLayout>
    );
}