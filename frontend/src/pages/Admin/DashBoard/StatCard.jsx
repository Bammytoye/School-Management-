import { Link } from 'react-router-dom'
import Tooltip from '../../../components/Tooltip'
import useCountUp from '../../../hooks/UseCountUp'

export default function StatCard({ icon, label, value, color, to, hint }) {
    const count = useCountUp(value)

    return (
        <Tooltip text={hint || label}>
            <Link
                to={to}
                className="card md:flex items-center gap-3 sm:gap-4 hidden
                    p-3 sm:p-4 md:p-5
                    hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group"
            >
                {/* Icon box */}
                <div className={`
                    flex-shrink-0 rounded-xl
                    flex items-center justify-center
                    w-10 h-10 text-lg
                    sm:w-11 sm:h-11 sm:text-xl
                    md:w-12 md:h-12 md:text-2xl
                    lg:w-14 lg:h-14 lg:text-3xl
                    ${color}
                `}>
                    {icon}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                    <p className="
                        truncate font-medium
                        text-xs text-gray-500 dark:text-gray-400
                        sm:text-xs
                        md:text-sm
                        lg:text-sm
                    ">
                        {label}
                    </p>
                    <p className="
                        font-bold tabular-nums text-gray-800 dark:text-white leading-tight
                        text-2xl
                        sm:text-2xl
                        md:text-3xl
                        lg:text-4xl
                    ">
                        {value === null ? '—' : count}
                    </p>
                </div>
            </Link>
        </Tooltip>
    )
}