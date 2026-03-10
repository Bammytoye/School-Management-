import { useVisible } from "../../hooks/useVisible";
import StatCard from "./StatCard";

export default function StatsSection() {
    const [statsRef, statsVisible] = useVisible(0.3);

    const stats = [
        { value: 500, suffix: "+", label: "Students Managed" },
        { value: 120, suffix: "+", label: "Courses Created" },
        { value: 98, suffix: "%", label: "Uptime Guaranteed" },
        { value: 3200, suffix: "+", label: "Grades Recorded" },
    ];

    return (
        <section
            id="stats"
            ref={statsRef}
            className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                        Trusted by schools everywhere
                    </h2>
                    <p className="text-blue-200 text-sm sm:text-base md:text-lg">
                        Real numbers from real institutions using SchoolMS every day.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    {stats.map((stat, index) => (
                        <StatCard key={stat.label} {...stat} index={index} start={statsVisible} />
                    ))}
                </div>
            </div>
        </section>
    );
}