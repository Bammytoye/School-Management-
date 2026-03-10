import { FaUser, FaBook, FaChartBar } from 'react-icons/fa'

const steps = [
    { step: '01', icon: <FaUser className="w-8 h-8" />, title: 'Create an account', desc: 'Register as an admin in seconds. No credit card, no setup fees.' },
    { step: '02', icon: <FaBook className="w-8 h-8" />, title: 'Add students & courses', desc: 'Import or add students manually. Create your course catalogue in minutes.' },
    { step: '03', icon: <FaChartBar className="w-8 h-8" />, title: 'Track everything', desc: 'Record attendance, set grades, and watch your analytics update in real time.' },
]

export default function HowItWorks() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest">How it works</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">Up and running in minutes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((s, i) => (
                        <div key={s.step} className="relative text-center group">
                            {i < 2 && (
                                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800 -translate-y-1/2 z-0" />
                            )}
                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-900 border-2 border-blue-100 dark:border-blue-900 shadow-lg flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {s.icon}
                                </div>
                                <div className="text-xs font-black text-blue-500 tracking-widest mb-2">STEP {s.step}</div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}