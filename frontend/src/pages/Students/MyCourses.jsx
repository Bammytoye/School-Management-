import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { enrolmentAPI } from '../../api/enrolmentAPI';
import { useAuth } from '../../context/AuthContext';

export default function MyCourses() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        enrolmentAPI.getMy()
            .then((res) => setCourses(res.data.courses))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}!</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading courses...</div>
                ) : courses.length === 0 ? (
                    <div className="card text-center py-16">
                        <div className="text-5xl mb-4">📚</div>
                        <p className="text-gray-500">You haven't been enrolled in any courses yet.</p>
                        <p className="text-gray-400 text-sm mt-1">Contact your admin to get enrolled.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <div key={course.id} className="card hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📖</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description || 'No description.'}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}