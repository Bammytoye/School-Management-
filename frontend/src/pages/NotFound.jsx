import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const home = user?.role === 'admin' ? '/admin/dashboard' : user ? '/my-courses' : '/login'

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 transition-colors">
            <div className="text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">

                {/* Animated 404 */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                    className="mb-4 sm:mb-5 md:mb-6 lg:mb-8"
                >
                    <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-black text-blue-600 dark:text-blue-400 leading-none select-none">
                        404
                    </div>
                </motion.div>

                {/* Illustration */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className=""
                >
                    <svg viewBox="0 0 200 120" className="w-32 sm:w-40 md:w-48 lg:w-60 xl:w-72 mx-auto" fill="none">
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
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        Page not found
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl text-gray-500 dark:text-gray-400 mb-6 sm:mb-7 md:mb-8 lg:mb-10 max-w-xs sm:max-w-sm md:max-w-md mx-auto leading-relaxed">
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-secondary text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3"
                        >
                            ← Go Back
                        </button>
                        <Link
                            to={home}
                            className="btn-primary text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3"
                        >
                            🏠 Go Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}