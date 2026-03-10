import { useState } from 'react'

export default function Tooltip({ text, children, position = 'bottom' }) {
    const [visible, setVisible] = useState(false)

    const posClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5 sm:mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5 sm:mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-1.5 sm:mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-1.5 sm:ml-2',
    }

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-600',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-600',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-600',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-600',
    }

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div className={`absolute z-50 ${posClasses[position]} pointer-events-none`}>
                    <div className="bg-gray-800 dark:bg-gray-600 text-white text-xs sm:text-xs md:text-sm rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 whitespace-nowrap shadow-lg">
                        {text}
                    </div>
                    <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
                </div>
            )}
        </div>
    )
}