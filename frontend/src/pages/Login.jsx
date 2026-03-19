import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaSchool } from 'react-icons/fa'
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value })

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

    // 🚀 DEMO LOGIN FUNCTION (NEW)
    const handleDemoLogin = async () => {
        setError('')
        setLoading(true)
        try {
            const demoEmail = 'demo@school.com'
            const demoPassword = 'demo123'

            const user = await login(demoEmail, demoPassword)
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/my-courses')
        } catch (err) {
            setError(err.response?.data?.message || 'Demo login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg mx-auto mb-4">
                        <FaSchool />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">
                        Sign in to <span className="font-semibold text-gray-700 dark:text-gray-300">
                            School<span className="text-blue-600">MS</span>
                        </span>
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
                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiMail className="text-gray-400" /> Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="admin@school.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiLock className="text-gray-400" /> Password
                        </label>

                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={form.password}
                                onChange={handleChange}
                                className="input w-full pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <FiLogIn />
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {/* 🚀 DEMO LOGIN BUTTON */}
                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        disabled={loading}
                        className="w-full border border-blue-500 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                        <FiLogIn />
                        Login as Demo Admin
                    </button>
                </form>

                {/* Register link */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">
                        Register
                    </Link>
                </p>

                {/* Home link */}
                <p className="text-center text-sm text-gray-400 mt-3">
                    Just browsing?{' '}
                    <Link to="/" className="text-blue-600 hover:underline font-medium">
                        Go to Home
                    </Link>
                </p>
            </div>
        </div>
    )
}