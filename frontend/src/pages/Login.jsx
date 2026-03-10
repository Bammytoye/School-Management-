import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const user = await login(form.email, form.password)
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/my-courses')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-lg lg:max-w-md xl:max-w-lg 2xl:max-w-xl p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl sm:text-6xl mb-3">🏫</div>
                    <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">
                        Sign in to School Management System
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="input w-full sm:text-sm md:text-base"
                            placeholder="admin@school.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="input w-full sm:text-sm md:text-base"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-base"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-center text-sm sm:text-base md:text-base text-gray-500 dark:text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                        Register
                    </Link>
                </p>

                {/* Demo Credentials
                <div className="mt-6 p-3 sm:p-4 md:p-5 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs sm:text-sm md:text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    <p className="font-medium mb-1 text-gray-600 dark:text-gray-300">Demo credentials:</p>
                    <p>Admin: admin@school.com / password</p>
                    <p>Student: alice@school.com / password</p>
                </div> */}
            </div>
        </div>
    )
}