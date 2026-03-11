import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MdOutlineGrade } from 'react-icons/md'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

export default function GradeChart({ data }) {
    return (
        <div className="card">
            <h2 className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
                <MdOutlineGrade className="text-blue-500 flex-shrink-0" />
                Grade Distribution
            </h2>

            {data.length === 0 ? (
                <div className="h-36 sm:h-44 md:h-48 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                    No grades yet
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={180} className="sm:!h-[200px] md:!h-[220px] lg:!h-[240px]">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="grade"
                            outerRadius="60%"
                            label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                        >
                            {data.map((none, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [value, `Grade ${name}`]}
                            contentStyle={{
                                fontSize: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => `Grade ${value}`}
                            wrapperStyle={{ fontSize: '12px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}