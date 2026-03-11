import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Tooltip from './Tooltip'
import { FiLogOut, FiSun, FiMoon, FiMenu } from 'react-icons/fi'
import { FaSchool } from 'react-icons/fa'

export default function NavBar({ onMenuClick }) {
    const { user, logout } = useAuth()
    const { dark, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const getAvatarSrc = (avatarUrl) => {
        if (!avatarUrl) return null
        if (avatarUrl.startsWith('http')) return avatarUrl   
        return `${avatarUrl}?t=${Date.now()}`                
    }

    const avatarSrc = getAvatarSrc(user?.avatar_url)

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-30 transition-colors">

            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
                {onMenuClick && (
                    <Tooltip text="Menu">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <FiMenu className="text-lg sm:text-xl" />
                        </button>
                    </Tooltip>
                )}

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
                    <div className="w-8 h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base sm:text-lg shadow-md group-hover:scale-105 transition-transform">
                        <FaSchool />
                    </div>
                    <span className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg lg:text-xl tracking-tight">
                        School<span className="text-blue-600">MS</span>
                    </span>
                </Link>
            </div>

            {/* Right: Dark mode, Avatar, Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">

                {/* Dark mode toggle */}
                <Tooltip text={dark ? 'Light mode' : 'Dark mode'}>
                    <button
                        onClick={toggleTheme}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                        {dark
                            ? <FiSun className="text-sm sm:text-base" />
                            : <FiMoon className="text-sm sm:text-base" />
                        }
                    </button>
                </Tooltip>

                {/* Profile / Avatar */}
                <Tooltip text="My Profile">
                    <Link to="/profile" className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 dark:bg-gray-700 text-white font-bold text-xs sm:text-sm ring-2 ring-blue-100 dark:ring-blue-900 hover:ring-blue-300 dark:hover:ring-blue-700 transition-all">
                            {avatarSrc ? (
                                <img
                                    src={avatarSrc}
                                    alt={user?.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || '?'
                            )}
                        </div>
                        <div className="hidden md:flex flex-col text-left">
                            <span className="text-sm font-medium text-gray-800 dark:text-white leading-tight">
                                {user?.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize leading-tight">
                                {user?.role}
                            </span>
                        </div>
                    </Link>
                </Tooltip>

                {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium transition-colors px-1.5 sm:px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <FiLogOut className="text-base sm:text-lg flex-shrink-0" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
            </div>
        </header>
    )
}