import { FaUser, FaBook, FaChartBar } from 'react-icons/fa'

const steps = [
    { step: '01', icon: <FaUser className="w-8 h-8 sm:w-9 sm:h-9" />, title: 'Create an account', desc: 'Register as an admin in seconds. No credit card, no setup fees.' },
    { step: '02', icon: <FaBook className="w-8 h-8 sm:w-9 sm:h-9" />, title: 'Add students & courses', desc: 'Import or add students manually. Create your course catalogue in minutes.' },
    { step: '03', icon: <FaChartBar className="w-8 h-8 sm:w-9 sm:h-9" />, title: 'Track everything', desc: 'Record attendance, set grades, and watch your analytics update in real time.' },
]

export default function HowItWorks() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 sm:mb-20">
                    <span className="text-blue-600 dark:text-blue-400 text-sm sm:text-base font-bold uppercase tracking-widest">How it works</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-2 mb-6 sm:mb-8 leading-tight">
                        Up and running in minutes
                    </h2>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
                    {steps.map((s, i) => (
                        <div key={s.step} className="relative text-center group">
                            {/* Connector line for steps 1 and 2 */}
                            {i < 2 && (
                                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800 -translate-y-1/2 z-0" />
                            )}

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white dark:bg-gray-900 border-2 border-blue-100 dark:border-blue-900 shadow-lg flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {s.icon}
                                </div>

                                {/* Step Number */}
                                <div className="text-xs sm:text-sm md:text-base font-black text-blue-500 tracking-widest mb-2 sm:mb-3">STEP {s.step}</div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">{s.title}</h3>

                                {/* Description */}
                                <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}