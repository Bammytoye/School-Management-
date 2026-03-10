import { useState, useEffect } from "react";

export default function UseCountUp(target, duration = 1600, start = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;

        let startTime;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const progressRatio = Math.min(progress / duration, 1);
            setCount(Math.floor(target * progressRatio));
            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                setCount(target); // ensure it reaches the exact target
            }
        };

        requestAnimationFrame(step);
    }, [target, duration, start]);

    return count;
}