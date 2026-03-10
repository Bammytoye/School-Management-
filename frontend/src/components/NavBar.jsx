import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Tooltip from './Tooltip'

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth()
    const { dark, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between transition-colors sticky top-0 z-30">
            <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="text-xl">☰</span>
                    </button>
                )}
                <span className="text-2xl">🏫</span>
                <span className="font-bold text-gray-800 dark:text-white text-lg hidden sm:block">SchoolMS</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Dark mode toggle */}
                <Tooltip text={dark ? 'Light mode' : 'Dark mode'}>
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg"
                    >
                        {dark ? '☀️' : '🌙'}
                    </button>
                </Tooltip>

                {/* User info — hidden on very small screens */}
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-800 dark:text-white leading-tight">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>

                {/* Avatar */}
                <Tooltip text="My Profile">
                    <Link to="/profile">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer overflow-hidden">
                            {user?.avatar_url
                                ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                : user?.name?.charAt(0).toUpperCase()
                            }
                        </div>
                    </Link>
                </Tooltip>

                {/* Logout */}
                {/* <Tooltip text="Logout"> */}
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                        Logout
                    </button>
                {/* </Tooltip> */}
            </div>
        </header>
    )
}