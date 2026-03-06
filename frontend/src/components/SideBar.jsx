import { NavLink } from 'react-router-dom';

const links = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/students', icon: '👥', label: 'Students' },
    { to: '/admin/courses', icon: '📚', label: 'Courses' },
    { to: '/admin/enrolments', icon: '📋', label: 'Enrolments' },
];

export default function Sidebar() {
    return (
        <aside className="w-56 bg-gray-900 min-h-screen flex flex-col py-6 px-3">
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`
                    }
                >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                </NavLink>
            ))}
        </aside>
    );
}