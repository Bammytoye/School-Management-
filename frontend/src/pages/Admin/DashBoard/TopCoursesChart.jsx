import {
    ResponsiveContainer, BarChart, Bar,
    XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts'
import { FiBookOpen } from 'react-icons/fi'

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd']

export default function TopCoursesChart({ data }) {
    return (
        <div className="card">
            <h2 className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
                <FiBookOpen className="text-blue-500 flex-shrink-0" />
                Top Courses
            </h2>

            {data.length === 0 ? (
                <div className="h-36 sm:h-44 md:h-48 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                    No enrolments yet
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={180} className="sm:!h-[200px] md:!h-[220px] lg:!h-[240px]">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            horizontal={false}
                        />
                        <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="title"
                            width={90}
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => v.length > 12 ? `${v.slice(0, 12)}…` : v}
                        />
                        <Tooltip
                            formatter={(value) => [value, 'Enrolments']}
                            contentStyle={{
                                fontSize: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}