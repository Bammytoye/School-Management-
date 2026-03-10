import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSchool } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

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
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-md group-hover:scale-105 transition-transform">
                            <FaSchool />
                        </div>
                        <span className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">
                            School<span className="text-blue-600">MS</span>
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((l) => (
                            <button
                                key={l.label}
                                onClick={() => scrollTo(l.href)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <button
                                onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/my-courses')}
                                className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md shadow-blue-200 dark:shadow-none"
                            >
                                Go to Dashboard →
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md shadow-blue-200 dark:shadow-none">
                                    Get Started →
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-3 px-2 space-y-1">
                        {navLinks.map((l) => (
                            <button key={l.label} onClick={() => scrollTo(l.href)}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                {l.label}
                            </button>
                        ))}
                        <div className="pt-2 flex flex-col gap-2 px-2">
                            {user ? (
                                <button onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/my-courses')}
                                    className="w-full py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl">
                                    Go to Dashboard →
                                </button>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMenuOpen(false)}
                                        className="w-full py-2.5 text-sm font-medium text-center border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200">
                                        Sign In
                                    </Link>
                                    <Link to="/register" onClick={() => setMenuOpen(false)}
                                        className="w-full py-2.5 text-sm font-semibold text-center bg-blue-600 text-white rounded-xl">
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