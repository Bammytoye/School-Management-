import { Link } from 'react-router-dom'
import { FiPlus, FiUsers, FiClipboard } from 'react-icons/fi'
import { MdOutlineMenuBook, MdOutlineGrade, MdOutlineCalendarToday } from 'react-icons/md'
import { HiOutlineLightningBolt } from 'react-icons/hi'

const actions = [
    { to: '/admin/students',   icon: <FiUsers />,                   label: 'Add Student',       variant: 'btn-primary'   },
    { to: '/admin/courses',    icon: <MdOutlineMenuBook />,          label: 'Add Course',        variant: 'btn-primary'   },
    { to: '/admin/enrolment',  icon: <FiClipboard />,               label: 'Manage Enrolment',  variant: 'btn-primary'   },
    { to: '/admin/grades',     icon: <MdOutlineGrade />,             label: 'Grade Students',    variant: 'btn-secondary' },
    { to: '/admin/attendance', icon: <MdOutlineCalendarToday />,     label: 'Mark Attendance',   variant: 'btn-secondary' },
]

export default function QuickActions() {
    return (
        <div className="card">
            <h2 className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
                <HiOutlineLightningBolt className="text-yellow-400 flex-shrink-0" />
                Quick Actions
            </h2>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                {actions.map(({ to, icon, label, variant }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`${variant} flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2`}
                    >
                        <span className="text-sm sm:text-base flex-shrink-0">{icon}</span>
                        <span className="truncate">{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}