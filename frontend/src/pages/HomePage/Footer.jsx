import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm">🏫</div>
                    <span className="font-bold text-white">School<span className="text-blue-400">MS</span></span>
                </div>
                <p className="text-sm">© {new Date().getFullYear()} SchoolMS. Built with ❤️ for educators.</p>
                <div className="flex gap-5 text-sm">
                    <Link to="/login"    className="hover:text-white transition-colors">Sign In</Link>
                    <Link to="/register" className="hover:text-white transition-colors">Register</Link>
                </div>
            </div>
        </footer>
    )
}