const illustrations = {
    students: (
        <svg viewBox="0 0 200 160" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-28 h-24 sm:w-32 sm:h-28 md:w-36 md:h-30 lg:w-40 lg:h-32 mx-auto">
            <circle cx="100" cy="55" r="30" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
            <circle cx="100" cy="45" r="14" fill="#93C5FD"/>
            <path d="M65 110 Q100 85 135 110 L138 140 H62 Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
        </svg>
    ),
}

export default function EmptyState({
    type = 'students',
    title,
    description,
    action,
    actionLabel
}) {
    return (
        <div className="
            flex flex-col items-center justify-center
            py-12 sm:py-14 md:py-16
            px-4 sm:px-6
            text-center
            max-w-sm sm:max-w-md mx-auto
        ">

            {illustrations[type] || illustrations.students}

            <h3 className="
                mt-4
                text-base sm:text-lg md:text-xl
                font-semibold
                text-gray-700 dark:text-gray-200
            ">
                {title || 'Nothing here yet'}
            </h3>

            <p className="
                mt-1
                text-xs sm:text-sm md:text-sm
                text-gray-500 dark:text-gray-400
                max-w-xs sm:max-w-sm
            ">
                {description || 'Get started by adding your first item.'}
            </p>

            {action && (
                <button
                    onClick={action}
                    className="btn-primary mt-4 sm:mt-5 text-xs sm:text-sm px-4 py-2"
                >
                    {actionLabel || 'Add New'}
                </button>
            )}
        </div>
    )
}