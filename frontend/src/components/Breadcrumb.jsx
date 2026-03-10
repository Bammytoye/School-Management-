import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiChevronRight } from 'react-icons/fi'

const routeLabels = {
    'admin':      'Admin',
    'dashboard':  'Dashboard',
    'students':   'Students',
    'courses':    'Courses',
    'enrolment':  'Enrolment',
    'grades':     'Grades',
    'attendance': 'Attendance',
    'profile':    'My Profile',
    'my-courses': 'My Courses',
}

export default function Breadcrumb() {
    const location = useLocation()
    const segments = location.pathname.split('/').filter(Boolean)

    if (segments.length <= 1) return null

    const crumbs = segments.map((seg, i) => {
        const path  = '/' + segments.slice(0, i + 1).join('/')
        const label = routeLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)
        const isLast = i === segments.length - 1
        return { path, label, isLast }
    })

    return (
        <nav className="flex items-center flex-wrap gap-1 sm:gap-1.5 text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6 text-gray-500 dark:text-gray-400">

            {/* Home icon */}
            <Link
                to="/"
                className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
                <FiHome className="text-sm sm:text-base" />
            </Link>

            {crumbs.map((crumb) => (
                <span key={crumb.path} className="flex items-center gap-1 sm:gap-1.5">
                    <FiChevronRight className="text-gray-300 dark:text-gray-600 text-xs sm:text-sm flex-shrink-0" />
                    {crumb.isLast ? (
                        <span className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-[120px] sm:max-w-[180px] md:max-w-xs">
                            {crumb.label}
                        </span>
                    ) : (
                        <Link
                            to={crumb.path}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px]"
                        >
                            {crumb.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    )
}