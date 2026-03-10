import FeatureCard from './FeatureCard'

const features = [
    { title: 'Student Management', desc: 'Register, search, and manage all students with role-based access control and detailed profiles.' },
    { title: 'Course Catalogue', desc: 'Create and organise courses, assign instructors, and manage course materials in one place.' },
    { title: 'Smart Enrolments', desc: 'Bulk-enrol students into courses, track enrolment history, and manage capacity effortlessly.' },
    { title: 'Grades & Assessment', desc: 'Record scores, auto-calculate letter grades (A–F), and add remarks for every student.' },
    { title: 'Attendance Tracking', desc: 'Mark present, absent, or late per session. View summaries and spot patterns instantly.' },
    { title: 'Analytics Dashboard', desc: 'Live charts for enrolments over time, grade distribution, top courses, and attendance rates.' },
]

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest">Features</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">Everything you need to run your school</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Built for administrators, teachers and students. No complexity, no clutter — just what matters.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
                </div>
            </div>
        </section>
    )
}