const getStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' }

    let score = 0
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        longEnough: password.length >= 12,
    }

    score += checks.length ? 1 : 0
    score += checks.upper ? 1 : 0
    score += checks.lower ? 1 : 0
    score += checks.number ? 1 : 0
    score += checks.special ? 1 : 0
    score += checks.longEnough ? 1 : 0

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-500', width: 'w-1/4' }
    if (score <= 3) return { score, label: 'Fair', color: 'bg-orange-400', text: 'text-orange-400', width: 'w-2/4' }
    if (score <= 4) return { score, label: 'Good', color: 'bg-yellow-400', text: 'text-yellow-500', width: 'w-3/4' }
    return { score, label: 'Strong', color: 'bg-green-500', text: 'text-green-500', width: 'w-full' }
}

export default function PasswordStrength({ password }) {
    if (!password) return null

    const strength = getStrength(password)

    const hints = [
        { label: '8+ characters', pass: password.length >= 8 },
        { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
        { label: 'Number', pass: /[0-9]/.test(password) },
        { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
    ]

    return (
        <div className="mt-2 space-y-2">
            {/* Strength bar */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                </div>
                <span className={`text-xs font-medium ${strength.text}`}>
                    {strength.label}
                </span>
            </div>

            {/* Hints */}
            <div className="grid grid-cols-2 gap-1">
                {hints.map((hint) => (
                    <div key={hint.label} className="flex items-center gap-1.5">
                        <span className={`text-xs ${hint.pass ? 'text-green-500' : 'text-gray-400 dark:text-gray-600'}`}>
                            {hint.pass ? '✓' : '○'}
                        </span>
                        <span className={`text-xs ${hint.pass ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                            {hint.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}