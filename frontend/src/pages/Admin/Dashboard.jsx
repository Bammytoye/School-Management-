import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'

import WelcomeBanner from './DashBoard/WelcomeBanner'
// import StatsGrid from './DashBoard/StatsGrid'
import EnrolmentChart from './DashBoard/EnrolmentChart'
import GradeChart from './DashBoard/GradeChart'
import TopCoursesChart from './DashBoard/TopCoursesChart'
import AttendanceChart from './DashBoard/AttendanceChart'
import QuickActions from './DashBoard/QuickActions'

import { useAuth } from '../../context/AuthContext'
import { dashboardAPI } from '../../API/dashboardAPI'  

export default function Dashboard() {
    const { user } = useAuth()

    // const [stats, setStats] = useState(null)
    const [enrolByMonth, setEnrolMonth] = useState([])
    const [gradesDist, setGradesDist] = useState([])
    const [topCourses, setTopCourses] = useState([])
    const [attendance, setAttendance] = useState([])
    // const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const [statsRes, chartsRes] = await Promise.all([
                    dashboardAPI.getStats(),    // enrolmentAPI.getStats()
                    dashboardAPI.getCharts()    // api.get('/dashboard/charts')
                ])

                console.log('📊 Stats:', statsRes.data);  
                // setStats(statsRes.data.stats)

                const c = chartsRes.data

                setEnrolMonth(c.enrolmentsByMonth || [])
                setGradesDist(c.gradeDistribution || [])
                setTopCourses(c.topCourses || [])
                setAttendance(c.attendanceSummary || [])

            } catch (error) {
                console.error('Dashboard load error:', error)
            }

            // setLoading(false)
        }

        load()
    }, [])

    return (
        <AdminLayout>
            <WelcomeBanner user={user} />

            {/* <StatsGrid stats={stats} loading={loading} /> */}

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <EnrolmentChart data={enrolByMonth} />
                <GradeChart data={gradesDist} />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TopCoursesChart data={topCourses} />
                <AttendanceChart data={attendance} />
            </div>

            <QuickActions />
        </AdminLayout>
    )
}