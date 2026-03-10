import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { FiTrendingUp } from 'react-icons/fi'

export default function EnrolmentChart({ data }) {
    if (!data.length) {
        return (
            <div className="card h-36 sm:h-44 md:h-48 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                No data yet
            </div>
        )
    }

    return (
        <div className="card">
            <h2 className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
                <FiTrendingUp className="text-blue-500 flex-shrink-0" />
                Enrolments Over Time
            </h2>

            <ResponsiveContainer width="100%" height={180} className="sm:!h-[200px] md:!h-[220px] lg:!h-[240px]">
                <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="enrolGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={30}
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
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#enrolGradient)"
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}