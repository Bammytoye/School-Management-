import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-2xl">🏫</span>
                <span className="font-bold text-gray-800 text-lg">SchoolMS</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                    Logout
                </button>
            </div>
        </header>
    );
}