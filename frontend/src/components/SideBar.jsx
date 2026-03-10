import { NavLink } from 'react-router-dom'
import { MdOutlineDashboard, MdOutlinePeople, MdOutlineMenuBook, MdOutlineGrade, MdOutlineCalendarToday } from 'react-icons/md'
import { FiClipboard, FiUser } from 'react-icons/fi'
import { FaSchool } from 'react-icons/fa'

const links = [
    { to: '/admin/dashboard', icon: <MdOutlineDashboard />, label: 'Dashboard' },
    { to: '/admin/students', icon: <MdOutlinePeople />, label: 'Students' },
    { to: '/admin/courses', icon: <MdOutlineMenuBook />, label: 'Courses' },
    { to: '/admin/enrolment', icon: <FiClipboard />, label: 'Enrolment' },
    { to: '/admin/grades', icon: <MdOutlineGrade />, label: 'Grades' },
    { to: '/admin/attendance', icon: <MdOutlineCalendarToday />, label: 'Attendance' },
    { to: '/profile', icon: <FiUser />, label: 'My Profile' },
]

export default function SideBar() {
    return (
        <aside className="
            min-h-screen flex flex-col py-4 px-2 transition-all bg-gray-900 dark:bg-gray-950
            w-14 sm:w-14 md:w-16 lg:w-56 xl:w-60 2xl:w-64
        ">
            {/* Navigation */}
            <nav className="flex flex-col flex-1 gap-0.5">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        title={link.label}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors
                            px-2 py-2.5 justify-center
                            lg:px-4 lg:py-2.5 lg:justify-start
                            ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <span className="text-lg sm:text-xl flex-shrink-0">
                            {link.icon}
                        </span>
                        <span className="hidden lg:block truncate">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="text-xs text-gray-500 px-2 lg:px-4 mt-6 text-center lg:text-left">
                <span className="hidden lg:block">© {new Date().getFullYear()} SchoolMS</span>
                <span className="lg:hidden">©</span>
            </div>
        </aside>
    )
}