import { Link, useLocation } from 'react-router-dom'

const routeLabels = {
    'admin': 'Admin',
    'dashboard': 'Dashboard',
    'students': 'Students',
    'courses': 'Courses',
    'enrolment': 'Enrolment',
    'grades': 'Grades',
    'attendance': 'Attendance',
    'profile': 'My Profile',
    'my-courses': 'My Courses',
}

export default function Breadcrumb() {
    const location = useLocation()
    const segments = location.pathname.split('/').filter(Boolean)

    if (segments.length <= 1) return null // no breadcrumb on top-level pages

    const crumbs = segments.map((seg, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/')
        const label = routeLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)
        const isLast = i === segments.length - 1
        return { path, label, isLast }
    })

    return (
        <nav className="flex items-center gap-1.5 text-sm mb-5 text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                🏠
            </Link>
            {crumbs.map((crumb) => (
                <span key={crumb.path} className="flex items-center gap-1.5">
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    {crumb.isLast ? (
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                            {crumb.label}
                        </span>
                    ) : (
                        <Link
                            to={crumb.path}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {crumb.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    )
}