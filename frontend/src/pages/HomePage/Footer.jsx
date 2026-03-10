import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm sm:text-base">
                        🏫
                    </div>
                    <span className="font-bold text-white text-sm sm:text-base">
                        School<span className="text-blue-400">MS</span>
                    </span>
                </div>

                {/* Copyright */}
                <p className="text-xs sm:text-sm md:text-base text-center md:text-left">
                    © {new Date().getFullYear()} SchoolMS. Built with ❤️ for educators by ZekeTech.
                </p>

                {/* Links */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 text-sm">
                    <Link to="/login" className="hover:text-white transition-colors text-center sm:text-left">
                        Sign In
                    </Link>
                    <Link to="/register" className="hover:text-white transition-colors text-center sm:text-left">
                        Register
                    </Link>
                </div>
            </div>
        </footer>
    )
}