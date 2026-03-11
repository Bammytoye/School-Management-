import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaSchool } from 'react-icons/fa'
import { FiUser, FiMail, FiLock, FiUserPlus, FiSun, FiMoon } from 'react-icons/fi'
import { authAPI } from '../API/authAPI'
import PasswordStrength from '../components/PasswordStrength'

export default function Register() {
    const navigate              = useNavigate()
    const [form, setForm]       = useState({ name: '', email: '', password: '' })
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await authAPI.register(form)
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.')
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
                        Create Account
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">
                        Register for <span className="font-semibold text-gray-700 dark:text-gray-300">School<span className="text-blue-600">MS</span></span>
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
                        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiUser className="text-gray-400 flex-shrink-0" /> Full Name
                        </label>
                        <input
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="First and Last Name"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiMail className="text-gray-400 flex-shrink-0" /> Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="example@gmail.com"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FiLock className="text-gray-400 flex-shrink-0" /> Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="••••••••"
                        />
                        <PasswordStrength password={form.password} />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-2 sm:mt-3 flex items-center justify-center gap-2"
                    >
                        <FiUserPlus className="flex-shrink-0" />
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                {/* Sign in link */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>

                {/* Home link */}
                <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-3">
                    Just browsing?{' '}
                    <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Go to Home
                    </Link>
                </p>
            </div>
        </div>
    )
}