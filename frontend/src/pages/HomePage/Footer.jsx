import { FaSchool } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 py-6 transition-colors">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base sm:text-lg shadow-md">
                        <FaSchool />
                    </div>
                    <span className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg lg:text-xl tracking-tight">
                        School<span className="text-blue-600">MS</span>
                    </span>
                </div>

                {/* Copyright */}
                <p className="text-xs sm:text-sm text-center md:text-left">
                    © {new Date().getFullYear()} SchoolMS. Built with ❤️ for educators by ZekeTech.
                </p>

                {/* Links */}
                <div className="flex gap-4 sm:gap-5 text-sm">
                    <Link to="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                        Register
                    </Link>
                </div>
            </div>
        </footer>
    )
}