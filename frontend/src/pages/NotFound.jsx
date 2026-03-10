import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const home = user?.role === 'admin' ? '/admin/dashboard' : user ? '/my-courses' : '/login'

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 transition-colors">
            <div className="text-center max-w-md">

                {/* Animated 404 */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                    className="mb-6"
                >
                    <div className="text-9xl font-black text-blue-600 dark:text-blue-400 leading-none select-none">
                        404
                    </div>
                </motion.div>

                {/* Illustration */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <svg viewBox="0 0 200 120" className="w-48 mx-auto" fill="none">
                        <rect x="20" y="20" width="160" height="80" rx="12" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2" />
                        <rect x="35" y="38" width="60" height="8" rx="4" fill="#93C5FD" />
                        <rect x="35" y="54" width="130" height="5" rx="2.5" fill="#BFDBFE" />
                        <rect x="35" y="66" width="100" height="5" rx="2.5" fill="#BFDBFE" />
                        <circle cx="155" cy="30" r="18" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="2" />
                        <text x="147" y="37" fontSize="16">🔍</text>
                        <circle cx="155" cy="30" r="6" fill="none" stroke="#F59E0B" strokeWidth="2" />
                        <line x1="159" y1="34" x2="165" y2="40" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Page not found
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-secondary"
                        >
                            ← Go Back
                        </button>
                        <Link to={home} className="btn-primary">
                            🏠 Go Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}