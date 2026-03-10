import UseCountUp from "../../hooks/UseCountUp"

export default function StatCard({ value, suffix, label, index, start }) {
    const count = UseCountUp(value, 1600, start)

    return (
        <div
            className="text-center"
            style={{
                opacity: start ? 1 : 0,
                transform: start ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
            }}
        >
            <div className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-blue-200 text-sm font-medium mt-1">{label}</div>
        </div>
    )
}