import { useState } from 'react'

export default function Tooltip({ text, children, position = 'top' }) {
    const [visible, setVisible] = useState(false)

    const posClasses = {
        top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left:   'right-full top-1/2 -translate-y-1/2 mr-2',
        right:  'left-full top-1/2 -translate-y-1/2 ml-2',
    }

    const arrowClasses = {
        top:    'top-full left-1/2 -translate-x-1/2 border-t-gray-800',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800',
        left:   'left-full top-1/2 -translate-y-1/2 border-l-gray-800',
        right:  'right-full top-1/2 -translate-y-1/2 border-r-gray-800',
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
                    <div className="bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                        {text}
                    </div>
                    <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
                </div>
            )}
        </div>
    )
}