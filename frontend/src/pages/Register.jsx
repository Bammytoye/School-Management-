import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../API/authAPI'
import PasswordStrength from '../components/PasswordStrength'

export default function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
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
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-lg lg:max-w-md xl:max-w-lg 2xl:max-w-xl p-6 sm:p-8 md:p-10 border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl sm:text-6xl mb-3">🎓</div>
                    <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-800 dark:text-white">Create Account</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">Register as a student</p>
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
                        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="input w-full sm:text-sm md:text-base"
                            placeholder="First and Last Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="input w-full sm:text-sm md:text-base"
                            placeholder="example@gmail.com"
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
                            placeholder="**********"
                        />
                        <PasswordStrength password={form.password} />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-base"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                {/* Sign in link */}
                <p className="text-center text-sm sm:text-base md:text-base text-gray-500 dark:text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}