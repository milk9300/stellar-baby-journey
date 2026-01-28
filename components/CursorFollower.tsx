import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CursorFollowerProps {
    progress: number;
    isActive: boolean;
}

const CursorFollower: React.FC<CursorFollowerProps> = ({ progress, isActive }) => {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

    useEffect(() => {
        const updatePos = (e: MouseEvent | TouchEvent) => {
            let clientX, clientY;
            if ('touches' in e) {
                if (e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    return;
                }
            } else {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            }
            setMousePos({ x: clientX, y: clientY });
        };

        // Track at all times or track on start
        window.addEventListener('mousemove', updatePos, { passive: true });
        window.addEventListener('touchstart', updatePos, { passive: true });
        window.addEventListener('touchmove', updatePos, { passive: true });
        window.addEventListener('mousedown', updatePos, { passive: true });

        return () => {
            window.removeEventListener('mousemove', updatePos);
            window.removeEventListener('touchstart', updatePos);
            window.removeEventListener('touchmove', updatePos);
            window.removeEventListener('mousedown', updatePos);
        };
    }, []);

    if (!isActive) return null;

    return createPortal(
        <div
            className="fixed pointer-events-none z-[99999] flex items-center justify-center pointer-events-none transition-none"
            style={{
                left: 0,
                top: 0,
                transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
                willChange: 'transform'
            }}
        >
            <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                {/* Outer Ring */}
                <div className="relative w-20 h-20 flex items-center justify-center drop-shadow-[0_0_15px_rgba(244,162,158,0.4)]">
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="rgba(244, 162, 158, 0.15)"
                            strokeWidth="5"
                            fill="white"
                            fillOpacity="0.05"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="#f4a29e"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray="213.6"
                            strokeDashoffset={213.6 - (213.6 * progress) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-100 ease-linear"
                        />
                    </svg>

                    {/* Inner Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span
                            className={`material-symbols-outlined text-primary transition-all duration-300 ${progress > 85 ? 'scale-125' : 'scale-100'}`}
                            style={{ fontSize: 28, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                        >
                            {progress >= 95 ? 'auto_awesome' : 'favorite'}
                        </span>
                    </div>
                </div>

                {/* Status Bubble */}
                <div className="absolute top-[100%] mt-4 whitespace-nowrap bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-primary font-handwritten text-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-primary/20 flex flex-col items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="leading-none">{progress < 100 ? '时光提取中...' : '已捕获记忆!'}</span>
                    <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Radiant Glow */}
                <div
                    className="absolute inset-0 bg-primary/10 blur-2xl rounded-full -z-10 transition-all duration-500"
                    style={{ transform: `scale(${1 + progress / 50})`, opacity: 0.2 + (progress / 200) }}
                ></div>
            </div>
        </div>,
        document.body
    );
};

export default CursorFollower;
