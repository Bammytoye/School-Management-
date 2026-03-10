import { Link } from 'react-router-dom'

export default function CTASection() {
    return (
        <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Ready to get started?</h2>
                <p className="text-blue-100 text-lg mb-10">Join schools already using SchoolMS to manage students, courses, and more.</p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link to="/register"
                        className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-xl text-base hover:scale-105 duration-200 inline-block">
                        Create Free Account →
                    </Link>
                    <Link to="/login"
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-colors text-base inline-block">
                        Sign In
                    </Link>
                </div>
            </div>
        </section>
    )
}