import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSchool } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Stats', href: '#stats' },
    { label: 'Reviews', href: '#reviews' },
]

export default function HomeNavbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [])

    const scrollTo = (href) => {
        setMenuOpen(false)
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/5' : 'bg-transparent'
        }`}>
            <div className="max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
                <div className="flex items-center justify-between h-14 sm:h-15 md:h-16 lg:h-17 xl:h-18">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
                        <div className="w-8 h-8 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base sm:text-lg shadow-md group-hover:scale-105 transition-transform">
                            <FaSchool />
                        </div>
                        <span className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl tracking-tight">
                            School<span className="text-blue-600">MS</span>
                        </span>
                    </Link>

                    {/* Desktop nav links — hidden on sm, visible md+ */}
                    <div className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-2">
                        {navLinks.map((l) => (
                            <button
                                key={l.label}
                                onClick={() => scrollTo(l.href)}
                                className="px-3 py-2 md:px-3.5 lg:px-4 xl:px-5 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    {/* CTA buttons — hidden on sm, visible md+ */}
                    <div className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4 flex-shrink-0">
                        {user ? (
                            <button
                                onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/my-courses')}
                                className="px-4 py-2 md:px-4 lg:px-5 xl:px-6 text-xs md:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md shadow-blue-200 dark:shadow-none whitespace-nowrap"
                            >
                                Go to Dashboard →
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-3 py-2 md:px-4 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 md:px-4 lg:px-5 xl:px-6 text-xs md:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md shadow-blue-200 dark:shadow-none whitespace-nowrap"
                                >
                                    Get Started →
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger — visible only on sm and below */}
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile menu — sm and below only */}
                {menuOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-3 px-2 space-y-1 rounded-b-2xl shadow-xl">
                        {navLinks.map((l) => (
                            <button
                                key={l.label}
                                onClick={() => scrollTo(l.href)}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                {l.label}
                            </button>
                        ))}
                        <div className="pt-2 flex flex-col gap-2 px-2 pb-1">
                            {user ? (
                                <button
                                    onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/my-courses')}
                                    className="w-full py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl"
                                >
                                    Go to Dashboard →
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="w-full py-2.5 text-sm font-medium text-center border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMenuOpen(false)}
                                        className="w-full py-2.5 text-sm font-semibold text-center bg-blue-600 text-white rounded-xl"
                                    >
                                        Get Started →
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}