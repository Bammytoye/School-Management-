const testimonials = [
    { name: 'Mrs. Adaeze Okafor', role: 'School Administrator', text: 'SchoolMS completely transformed how we manage our 300+ students. Everything is in one place and the interface is beautiful.', avatar: 'A' },
    { name: 'Mr. Chidi Eze', role: 'Head Teacher', text: 'The attendance and grading features save us hours every week. Our staff adopted it immediately — no training needed.', avatar: 'C' },
    { name: 'Miss Ngozi Adeyemi', role: 'Student', text: 'I can check my grades, attendance and courses anytime on my phone. It feels modern and actually works.', avatar: 'N' },
]

export default function Testimonials() {
    return (
        <section id="reviews" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest">Reviews</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">Loved by educators</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div key={t.name}
                            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="flex gap-0.5 mb-4">
                                {[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400 text-sm">★</span>)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}