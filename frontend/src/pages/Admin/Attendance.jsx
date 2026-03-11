import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { MdOutlineCalendarToday, MdCheckCircle, MdCancel, MdAccessTime } from 'react-icons/md'
import AdminLayout from '../../components/AdminLayout'
import EmptyState from '../../components/EmptyState'
import { TableSkeleton } from '../../components/Skeleton'
import { attendanceAPI } from '../../API/gradesAPI'
import { courseAPI } from '../../API/courseAPI'
import { enrolmentAPI } from '../../API/enrolmentAPI'
import { useNavigate } from 'react-router-dom'

const STATUS_STYLES = {
    present: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
    absent: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
    late: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
}

const STATUS_ICONS = {
    present: <MdCheckCircle className="text-sm" />,
    absent: <MdCancel className="text-sm" />,
    late: <MdAccessTime className="text-sm" />,
}

export default function Attendance() {
    const navigate = useNavigate()

    const [courses, setCourses] = useState([])
    const [selectedCourse, setSC] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [enrolments, setEnrolments] = useState([])
    const [records, setRecords] = useState({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        courseAPI.getAll({ limit: 100 }).then((r) => setCourses(r.data.courses))
    }, [])

    useEffect(() => {
        if (!selectedCourse) return
        setLoading(true)
        Promise.all([
            enrolmentAPI.getAll(),
            attendanceAPI.getAll({ course_id: selectedCourse, date }),
        ]).then(([e, a]) => {
            const enrolled = e.data.enrolments.filter((en) => String(en.course_id) === String(selectedCourse))
            setEnrolments(enrolled)
            const rec = {}
            enrolled.forEach((en) => { rec[en.student_id] = 'present' })
            a.data.attendance.forEach((at) => { rec[at.user_id] = at.status })
            setRecords(rec)
        }).finally(() => setLoading(false))
    }, [selectedCourse, date])

    const toggle = (userId, status) => setRecords((r) => ({ ...r, [userId]: status }))

    const handleSave = async () => {
        if (!selectedCourse) return
        setSaving(true)
        try {
            const recordsArr = Object.entries(records).map(([user_id, status]) => ({ user_id: parseInt(user_id), status }))
            await attendanceAPI.mark({ course_id: parseInt(selectedCourse), date, records: recordsArr })
            toast.success('Attendance saved!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving attendance.')
        } finally { setSaving(false) }
    }

    const summary = Object.values(records)
    const presentCount = summary.filter((s) => s === 'present').length
    const absentCount = summary.filter((s) => s === 'absent').length
    const lateCount = summary.filter((s) => s === 'late').length

    return (
        <AdminLayout>

            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3 sm:mb-4"
            >
                <FiArrowLeft className="flex-shrink-0" />
                Back
            </button>

            {/* Page title */}
            <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                Attendance
            </h1>

            {/* Filters */}
            <div className="card mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-end">
                <div className="w-full sm:w-auto">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <FaChalkboardTeacher className="text-blue-500" />
                        Course
                    </label>
                    <select
                        className="input w-full sm:w-56 md:w-64 lg:w-72"
                        value={selectedCourse}
                        onChange={(e) => setSC(e.target.value)}
                    >
                        <option value="">Select Course</option>
                        {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
                <div className="w-full sm:w-auto">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <MdOutlineCalendarToday className="text-blue-500" />
                        Date
                    </label>
                    <input
                        type="date"
                        className="input w-full sm:w-auto"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {selectedCourse && (
                <>
                    {/* Summary badges */}
                    {enrolments.length > 0 && (
                        <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                            <span className="flex items-center gap-1 px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                                <MdCheckCircle /> Present: {presentCount}
                            </span>
                            <span className="flex items-center gap-1 px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">
                                <MdCancel /> Absent: {absentCount}
                            </span>
                            <span className="flex items-center gap-1 px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium">
                                <MdAccessTime /> Late: {lateCount}
                            </span>
                        </div>
                    )}

                    {/* Table */}
                    <div className="card overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm min-w-[480px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400 uppercase text-xs">
                                    <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap">Student</th>
                                    <th className="pb-2 sm:pb-3 pr-3 sm:pr-4 whitespace-nowrap hidden sm:table-cell">Email</th>
                                    <th className="pb-2 sm:pb-3 whitespace-nowrap">Status</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <TableSkeleton rows={5} cols={3} />
                            ) : (
                                <tbody>
                                    {enrolments.map((enrol) => (
                                        <tr key={enrol.id} className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                                <div>{enrol.student_name}</div>
                                                <div className="sm:hidden text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-normal">
                                                    {enrol.email}
                                                </div>
                                            </td>
                                            <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                                {enrol.email}
                                            </td>
                                            <td className="py-2.5 sm:py-3">
                                                <div className="flex gap-1 sm:gap-2 flex-wrap">
                                                    {['present', 'absent', 'late'].map((show) => (
                                                        <button
                                                            key={show}
                                                            onClick={() => toggle(enrol.student_id, show)}
                                                            className={`flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium border capitalize transition-all ${records[enrol.student_id] === show
                                                                ? STATUS_STYLES[show]
                                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                }`}
                                                        >
                                                            {STATUS_ICONS[show]}
                                                            <span className="hidden sm:inline">{show}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>

                        {!loading && enrolments.length === 0 && (
                            <EmptyState type="attendance" title="No students enrolled" description="Enrol students into this course first." />
                        )}

                        {!loading && enrolments.length > 0 && (
                            <div className="mt-3 sm:mt-4 md:mt-5 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 btn-primary text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2.5"
                                >
                                    <FiSave className="flex-shrink-0" />
                                    {saving ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {!selectedCourse && (
                <div className="card">
                    <EmptyState type="attendance" title="Select a course" description="Choose a course and date above to mark attendance." />
                </div>
            )}
        </AdminLayout>
    )
}