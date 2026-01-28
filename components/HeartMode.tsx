import React, { useState, useEffect } from 'react';

const HeartMode: React.FC = () => {
    const [hearts, setHearts] = useState<{ id: number; left: number; top: number; size: number }[]>([]);

    useEffect(() => {
        const triggerMode = () => {
            const newHearts = Array.from({ length: 20 }).map((_, i) => ({
                id: Date.now() + i,
                left: Math.random() * 100,
                top: 100 + Math.random() * 50,
                size: 20 + Math.random() * 30
            }));
            setHearts(newHearts);

            // Audio feedback (if supported)
            const audio = new Audio('https://www.soundjay.com/buttons/button-20.mp3');
            audio.volume = 0.2;
            audio.play().catch(() => { }); // Ignore if blocked by browser

            setTimeout(() => setHearts([]), 4000);
        };

        window.addEventListener('trigger-heart-mode', triggerMode);
        return () => window.removeEventListener('trigger-heart-mode', triggerMode);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {hearts.map((h) => (
                <div
                    key={h.id}
                    className="absolute text-primary animate-bounce opacity-80"
                    style={{
                        left: `${h.left}%`,
                        top: `${h.top}%`,
                        fontSize: `${h.size}px`,
                        transition: 'all 4s ease-out',
                        transform: `translateY(-${h.top + 200}px) scale(1.5)`,
                        opacity: 0
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                    </span>
                </div>
            ))}
            <style>
                {`
                    @keyframes heart-rise {
                        0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
                        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                    }
                `}
            </style>
        </div>
    );
};

export default HeartMode;
