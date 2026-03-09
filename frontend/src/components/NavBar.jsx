import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link } from 'react-router-dom'

export default function NavBar() {
    const { user, logout } = useAuth()
    const { dark, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
                <span className="text-2xl">🏫</span>
                <span className="font-bold text-gray-800 dark:text-white text-lg">SchoolMS</span>
            </div>

            <div className="flex items-center gap-4">
                {/* Dark mode toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg"
                    title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {dark ? '☀️' : '🌙'}
                </button>

                <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>

                <Link to="/profile">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </Link>

                <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}