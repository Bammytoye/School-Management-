const illustrations = {
    students: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 mx-auto">
            <circle cx="100" cy="55" r="30" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
            <circle cx="100" cy="45" r="14" fill="#93C5FD"/>
            <path d="M65 110 Q100 85 135 110 L138 140 H62 Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
            <circle cx="50" cy="70" r="18" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="2"/>
            <circle cx="50" cy="63" r="8" fill="#C4B5FD"/>
            <path d="M28 105 Q50 90 72 105 L74 125 H26 Z" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="2"/>
            <circle cx="150" cy="70" r="18" fill="#D1FAE5" stroke="#6EE7B7" strokeWidth="2"/>
            <circle cx="150" cy="63" r="8" fill="#6EE7B7"/>
            <path d="M128 105 Q150 90 172 105 L174 125 H126 Z" fill="#D1FAE5" stroke="#6EE7B7" strokeWidth="2"/>
        </svg>
    ),
    courses: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 mx-auto">
            <rect x="30" y="30" width="140" height="100" rx="8" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
            <rect x="45" y="50" width="80" height="8" rx="4" fill="#93C5FD"/>
            <rect x="45" y="68" width="110" height="6" rx="3" fill="#BFDBFE"/>
            <rect x="45" y="82" width="95" height="6" rx="3" fill="#BFDBFE"/>
            <rect x="45" y="96" width="70" height="6" rx="3" fill="#BFDBFE"/>
            <circle cx="155" cy="45" r="20" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="2"/>
            <text x="148" y="51" fontSize="16">📚</text>
        </svg>
    ),
    enrolments: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 mx-auto">
            <rect x="20" y="40" width="75" height="90" rx="8" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
            <rect x="35" y="60" width="45" height="6" rx="3" fill="#93C5FD"/>
            <rect x="35" y="74" width="35" height="5" rx="2.5" fill="#BFDBFE"/>
            <rect x="35" y="87" width="40" height="5" rx="2.5" fill="#BFDBFE"/>
            <rect x="105" y="40" width="75" height="90" rx="8" fill="#D1FAE5" stroke="#6EE7B7" strokeWidth="2"/>
            <rect x="120" y="60" width="45" height="6" rx="3" fill="#6EE7B7"/>
            <rect x="120" y="74" width="35" height="5" rx="2.5" fill="#A7F3D0"/>
            <rect x="120" y="87" width="40" height="5" rx="2.5" fill="#A7F3D0"/>
            <circle cx="100" cy="85" r="14" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="2"/>
            <text x="93" y="91" fontSize="14">🔗</text>
        </svg>
    ),
    grades: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 mx-auto">
            <rect x="40" y="20" width="120" height="120" rx="10" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2"/>
            <circle cx="100" cy="75" r="35" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
            <text x="82" y="87" fontSize="28" fontWeight="bold" fill="#2563EB">A</text>
            <rect x="55" y="120" width="90" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="55" y="120" width="72" height="8" rx="4" fill="#93C5FD"/>
        </svg>
    ),
    attendance: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 mx-auto">
            <rect x="30" y="25" width="140" height="120" rx="10" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2"/>
            <rect x="30" y="25" width="140" height="35" rx="10" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
            <rect x="30" y="45" width="140" height="15" fill="#DBEAFE"/>
            <text x="85" y="48" fontSize="12" fill="#1D4ED8" fontWeight="600">CALENDAR</text>
            {[0,1,2,3,4,5,6].map(i => (
                <rect key={i} x={42 + i*18} y="72" width="12" height="12" rx="3" fill="#E5E7EB"/>
            ))}
            {[0,1,2,3,4,5,6].map(i => (
                <rect key={i} x={42 + i*18} y="90" width="12" height="12" rx="3"
                    fill={i < 4 ? '#BBF7D0' : i === 4 ? '#FCA5A5' : '#E5E7EB'}/>
            ))}
            {[0,1,2,3,4,5,6].map(i => (
                <rect key={i} x={42 + i*18} y="108" width="12" height="12" rx="3"
                    fill={i < 5 ? '#BBF7D0' : '#E5E7EB'}/>
            ))}
        </svg>
    ),
    courses_student: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 mx-auto">
            <circle cx="100" cy="60" r="40" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="2"/>
            <text x="82" y="72" fontSize="32">🎓</text>
            <rect x="50" y="110" width="100" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="65" y="125" width="70" height="6" rx="3" fill="#E5E7EB"/>
        </svg>
    ),
    search: (
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 mx-auto">
            <circle cx="88" cy="72" r="38" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="3"/>
            <circle cx="88" cy="72" r="26" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
            <line x1="116" y1="100" x2="148" y2="132" stroke="#D1D5DB" strokeWidth="8" strokeLinecap="round"/>
            <text x="76" y="80" fontSize="20">🔍</text>
        </svg>
    ),
}

export default function EmptyState({ type = 'students', title, description, action, actionLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {illustrations[type] || illustrations.students}
            <h3 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                {title || 'Nothing here yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                {description || 'Get started by adding your first item.'}
            </p>
            {action && (
                <button onClick={action} className="btn-primary mt-5 text-sm">
                    {actionLabel || 'Add New'}
                </button>
            )}
        </div>
    )
}