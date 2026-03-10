import { useVisible } from '../../hooks/useVisible'
import { FaUserGraduate, FaBook, FaClipboardList, FaBullseye, FaChartBar, FaCalendarAlt } from 'react-icons/fa'

const iconMap = {
    'Student Management': <FaUserGraduate className="w-6 h-6" />,
    'Course Catalogue': <FaBook className="w-6 h-6" />,
    'Smart Enrolment': <FaClipboardList className="w-6 h-6" />,
    'Grades & Assessment': <FaBullseye className="w-6 h-6" />,
    'Attendance Tracking': <FaCalendarAlt className="w-6 h-6" />,
    'Analytics Dashboard': <FaChartBar className="w-6 h-6" />,
}

export default function FeatureCard({ title, desc, index }) {
    const [ref, visible] = useVisible(0.1)

    return (
        <div
            ref={ref}
            className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-blue-50 dark:hover:shadow-none transition-all duration-300 hover:-translate-y-1"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s, box-shadow 0.3s, border-color 0.3s`,
            }}
        >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {iconMap[title]}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
        </div>
    )
}