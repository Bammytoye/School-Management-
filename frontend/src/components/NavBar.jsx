import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Tooltip from './Tooltip';

export default function NavBar({ onMenuClick }) {
    const { user, logout } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Always reload avatar to avoid caching issues
    const avatarSrc = user?.avatar_url
        ? `http://localhost:8000${user.avatar_url}?t=${Date.now()}`
        : null;

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-3">
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="text-xl">☰</span>
                    </button>
                )}

                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="text-2xl">🏫</span>
                    <span className="font-bold text-gray-800 dark:text-white text-lg hidden sm:block">
                        SchoolMS
                    </span>
                </Link>
            </div>

            {/* Right: Dark mode, Avatar, Logout */}
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

                {/* Profile / Avatar */}
                <Tooltip text="My Profile">
                    <Link to="/profile" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-white font-bold text-sm ring-2 ring-blue-100 dark:ring-blue-900">
                            {avatarSrc ? (
                                <img
                                    src={avatarSrc}
                                    alt={user?.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || '?'
                            )}
                        </div>

                        <div className="hidden sm:flex flex-col text-left">
                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                                {user?.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {user?.role}
                            </span>
                        </div>
                    </Link>
                </Tooltip>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}