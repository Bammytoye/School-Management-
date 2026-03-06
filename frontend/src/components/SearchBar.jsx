import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search...' }) {
    const [value, setValue] = useState('');

    // Debounce — wait 400ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => onSearch(value), 400);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="input pl-9 w-64"
            />
        </div>
    );
}