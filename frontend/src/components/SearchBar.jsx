import { useState, useEffect } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

export default function SearchBar({ onSearch, placeholder = 'Search...' }) {
    const [value, setValue] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => onSearch(value), 400)
        return () => clearTimeout(timer)
    }, [value])

    const clear = () => { setValue(''); onSearch('') }

    return (
        <div className="relative w-full sm:w-56 md:w-64 lg:w-72 xl:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base pointer-events-none" />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="input w-full pl-8 sm:pl-9 pr-8 text-sm sm:text-base"
            />
            {value && (
                <button
                    onClick={clear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <FiX className="text-sm sm:text-base" />
                </button>
            )}
        </div>
    )
}