import { FaSchool } from 'react-icons/fa'

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
}

export default function WelcomeBanner({ user }) {
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-5 md:p-6 lg:p-7 mb-4 sm:mb-5 md:mb-6 flex items-center justify-between flex-wrap gap-3 sm:gap-4">

            <div className="min-w-0">
                <p className="text-blue-100 text-xs sm:text-sm font-medium truncate">
                    {today}
                </p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-0.5 sm:mt-1 truncate">
                    {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Here's what's happening at your school today.
                </p>
            </div>

            <FaSchool className="text-4xl sm:text-5xl md:text-6xl text-white/80 flex-shrink-0 select-none hidden xs:block sm:block" />
        </div>
    )
}