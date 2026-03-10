import { NavLink } from 'react-router-dom'

const links = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/students', icon: '👥', label: 'Students' },
    { to: '/admin/courses', icon: '📚', label: 'Courses' },
    { to: '/admin/enrolment', icon: '📋', label: 'Enrolment' },
    { to: '/admin/grades', icon: '🎯', label: 'Grades' },
    { to: '/admin/attendance', icon: '🗓️', label: 'Attendance' },
    { to: '/profile', icon: '👤', label: 'My Profile' },
]

export default function SideBar() {
    return (
        <aside className="w-56 min-h-screen bg-gray-900 dark:bg-gray-950 flex flex-col py-6 px-3 transition-all">

            {/* Logo / Title */}
            <div className="flex items-center gap-3 px-3 mb-8">
                <span className="text-2xl">🏫</span>
                <span className="text-lg font-bold text-white">SchoolMS</span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col flex-1">
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
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="text-xs text-gray-500 px-4 mt-6">
                © {new Date().getFullYear()} SchoolMS
            </div>

        </aside>
    )
}