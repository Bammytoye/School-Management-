import { FiUsers, FiBookOpen, FiClipboard, FiAward } from 'react-icons/fi'
import StatCard from './StatCard'
import { StatCardSkeleton } from '../../../components/Skeleton'

export default function StatsGrid({ stats, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-7 md:mb-8">
                {Array.from({ length: 4 }).map((none, index) => (
                    <StatCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-7 md:mb-8">
            <StatCard
                icon={<FiUsers className="text-blue-600 dark:text-blue-400" />}
                label="Students"
                value={stats?.total_students}
                color="bg-blue-100 dark:bg-blue-900/30"
                to="/admin/students"
                hint="Total registered students"
            />
            <StatCard
                icon={<FiBookOpen className="text-green-600 dark:text-green-400" />}
                label="Courses"
                value={stats?.total_courses}
                color="bg-green-100 dark:bg-green-900/30"
                to="/admin/courses"
                hint="Total active courses"
            />
            <StatCard
                icon={<FiClipboard className="text-purple-600 dark:text-purple-400" />}
                label="Enrolment"
                value={stats?.total_enrolment}
                color="bg-purple-100 dark:bg-purple-900/30"
                to="/admin/enrolment"
                hint="Total enrolments"
            />
            <StatCard
                icon={<FiAward className="text-orange-600 dark:text-orange-400" />}
                label="Admins"
                value={stats?.total_admins}
                color="bg-orange-100 dark:bg-orange-900/30"
                to="/admin/students"
                hint="Total admin users"
            />
        </div>
    )
}