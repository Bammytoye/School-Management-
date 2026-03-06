import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/authAPI';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authAPI.register(form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🎓</div>
                    <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-500 text-sm mt-1">Register as a student</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input name="name" required value={form.name} onChange={handleChange} className="input" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" required value={form.email} onChange={handleChange} className="input" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" required value={form.password} onChange={handleChange} className="input" placeholder="Min 6 characters" minLength={6} />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}