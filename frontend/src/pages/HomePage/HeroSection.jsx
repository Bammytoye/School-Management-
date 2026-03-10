import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function HeroSection() {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

            {/* Decorative blobs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-24">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-blue-200 dark:border-blue-800"
                    style={{ animation: 'fadeInDown 0.6s ease both' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    School Management Made Simple
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-6"
                    style={{ animation: 'fadeInUp 0.7s ease 0.1s both' }}>
                    Manage Your School<br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Like a Pro
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
                    style={{ animation: 'fadeInUp 0.7s ease 0.2s both' }}>
                    A complete platform for managing students, courses, grades, and attendance —
                    all in one beautiful, easy-to-use system.
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center justify-center gap-4 flex-wrap"
                    style={{ animation: 'fadeInUp 0.7s ease 0.3s both' }}>
                    {user ? (
                        <button
                            onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/my-courses')}
                            className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none transition-all duration-200 hover:scale-105 text-base flex items-center gap-2"
                        >
                            Open Dashboard
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    ) : (
                        <>
                            <Link to="/register"
                                className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none transition-all duration-200 hover:scale-105 text-base flex items-center gap-2">
                                Get Started Free
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            <Link to="/login"
                                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:scale-105 text-base shadow-sm">
                                Sign In
                            </Link>
                        </>
                    )}
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-10 flex-wrap"
                    style={{ animation: 'fadeInUp 0.7s ease 0.4s both' }}>
                    {['✅ Free to use', '🔒 Secure & private', '📱 Mobile friendly', '⚡ Lightning fast'].map((b) => (
                        <span key={b} className="text-sm text-gray-500 dark:text-gray-400 font-medium">{b}</span>
                    ))}
                </div>
            </div>
        </section>
    )
}