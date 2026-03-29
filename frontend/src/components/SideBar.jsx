import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MdOutlineDashboard, MdOutlinePeople, MdOutlineMenuBook, MdOutlineGrade, MdOutlineCalendarToday } from 'react-icons/md'
import { FiClipboard, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const links = [
    { to: '/admin/dashboard',  icon: <MdOutlineDashboard />,     label: 'Dashboard'  },
    { to: '/admin/students',   icon: <MdOutlinePeople />,        label: 'Students'   },
    { to: '/admin/courses',    icon: <MdOutlineMenuBook />,      label: 'Courses'    },
    { to: '/admin/enrolment',  icon: <FiClipboard />,            label: 'Enrolment'  },
    { to: '/admin/grades',     icon: <MdOutlineGrade />,         label: 'Grades'     },
    { to: '/admin/attendance', icon: <MdOutlineCalendarToday />, label: 'Attendance' },
    // { to: '/profile',          icon: <FiUser />,                 label: 'My Profile' },
]

export default function SideBar() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside className={`
            relative min-h-screen flex flex-col py-4 px-2 transition-all duration-300
            bg-gray-100 dark:bg-gray-900
            border-r border-gray-200 dark:border-gray-800
            ${collapsed ? 'w-14' : 'w-14 lg:w-56 xl:w-60 2xl:w-64'}
        `}>

            {/* Collapse toggle button */}
            <button
                onClick={() => setCollapsed(c => !c)}
                title={collapsed ? 'Expand' : 'Collapse'}
                className="
                    hidden absolute -right-3 top-6
                    w-6 h-6 rounded-full
                    bg-white dark:bg-gray-800
                    border border-gray-200 dark:border-gray-700
                    lg:flex items-center justify-center
                    text-gray-500 dark:text-gray-400
                    hover:text-blue-600 dark:hover:text-blue-400
                    hover:border-blue-300 dark:hover:border-blue-600
                    shadow-sm transition-colors z-10
                "
            >
                {collapsed
                    ? <FiChevronRight className="text-xs" />
                    : <FiChevronLeft  className="text-xs" />
                }
            </button>

            {/* Navigation */}
            <nav className="flex flex-col flex-1 gap-0.5 mt-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        title={link.label}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors
                            px-2 py-2.5 justify-center
                            ${!collapsed ? 'lg:px-4 lg:justify-start' : ''}
                            ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`
                        }
                    >
                        <span className="text-lg flex-shrink-0">
                            {link.icon}
                        </span>
                        
                        {/* Label: hidden when collapsed, hidden on small screens when not collapsed */}
                        <span className={`truncate transition-all duration-200 ${
                            collapsed ? 'hidden' : 'hidden lg:block'
                        }`}>
                            {link.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="text-xs text-gray-400 dark:text-gray-500 px-2 mt-6 text-center">
                {!collapsed && (
                    <span className="hidden lg:block text-left px-2">
                        © {new Date().getFullYear()} SchoolMS
                    </span>
                )}
                <span className={collapsed ? 'block' : 'lg:hidden'}>©</span>
            </div>
        </aside>
    )
}