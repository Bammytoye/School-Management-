import { useEffect, useState, useRef } from 'react'

export default function UseCountUp(target, duration = 1200) {
    const [count, setCount] = useState(0)
    const startTime = useRef(null)
    const rafRef    = useRef(null)

    useEffect(() => {
        if (target === null || target === undefined) return

        const end = parseInt(target, 10)
        if (isNaN(end)) return

        startTime.current = null

        const step = (timestamp) => {
            if (!startTime.current) startTime.current = timestamp
            const progress = Math.min((timestamp - startTime.current) / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) rafRef.current = requestAnimationFrame(step)
        }

        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [target, duration])

    return count
}