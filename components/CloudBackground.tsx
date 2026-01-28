import React from 'react';

const CloudBackground: React.FC = () => {
    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed inset-0 z-0 watercolor-bg overflow-hidden pointer-events-none">
            {/* Soft Sun/Glow */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full"></div>

            {/* Animated Clouds with Parallax */}
            {[...Array(8)].map((_, i) => {
                const speedV = 0.4 + (i % 3) * 0.15;
                const speedH = (i % 2 === 0 ? 0.15 : -0.15);
                const qSize = 0.6 + (i % 4) * 0.2;
                return (
                    <div
                        key={`cloud-${i}`}
                        className="absolute opacity-60 drop-shadow-sm transition-all duration-300"
                        style={{
                            top: `${(i * 15) % 100}%`,
                            left: `${(i * 25) % 100}%`,
                            transform: `translate(${scrollY * speedH}px, ${scrollY * speedV}px)`,
                            transition: 'transform 0.1s linear'
                        }}
                    >
                        <div
                            className="animate-float"
                            style={{
                                animationDelay: `${i * 1.2}s`,
                                animationDuration: `${12 + (i % 5) * 2}s`,
                                transform: `scale(${qSize})`
                            }}
                        >
                            <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="45" cy="55" r="35" fill={`url(#pink-cloud-${i})`} />
                                <circle cx="85" cy="45" r="40" fill={`url(#pink-cloud-${i})`} />
                                <circle cx="125" cy="60" r="30" fill={`url(#pink-cloud-${i})`} />
                                <circle cx="145" cy="65" r="25" fill={`url(#pink-cloud-${i})`} />
                                <defs>
                                    <linearGradient id={`pink-cloud-${i}`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#fff" stopOpacity="0.9" />
                                        <stop offset="0.5" stopColor="#ffe4e1" />
                                        <stop offset="1" stopColor="#ffc0cb" stopOpacity="0.6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                );
            })}

            {/* Drifting Feathers with Parallax */}
            {[...Array(12)].map((_, i) => {
                const speedV = 0.5 + (i % 4) * 0.2;
                const speedH = (i % 2 === 0 ? 0.2 : -0.2);
                return (
                    <div
                        key={`feather-${i}`}
                        className="absolute opacity-40 pointer-events-none"
                        style={{
                            top: `${(i * 123) % 100}%`,
                            left: `${(i * 456) % 100}%`,
                            transform: `translate(${scrollY * speedH}px, ${scrollY * speedV}px)`,
                            transition: 'transform 0.15s linear'
                        }}
                    >
                        <div
                            className="animate-sway"
                            style={{
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${5 + (i % 3) * 2}s`,
                            }}
                        >
                            <span className="material-symbols-outlined text-primary/40 select-none" style={{ fontSize: `${15 + (i % 5) * 5}px` }}>
                                nest_eco_leaf
                            </span>
                        </div>
                    </div>
                );
            })}

            {/* Twinkling Stars with Parallax */}
            {[...Array(20)].map((_, i) => {
                const speedV = 0.1 + (i % 2) * 0.1;
                return (
                    <div
                        key={`star-${i}`}
                        className="absolute opacity-20 pointer-events-none"
                        style={{
                            top: `${(i * 137) % 100}%`,
                            left: `${(i * 199) % 100}%`,
                            transform: `translateY(${scrollY * speedV}px)`,
                        }}
                    >
                        <div
                            className="animate-pulse"
                            style={{
                                animationDelay: `${i * 0.3}s`,
                                animationDuration: `${2 + (i % 2)}s`,
                            }}
                        >
                            <span className="material-symbols-outlined text-primary/30" style={{ fontSize: '10px' }}>
                                sparkles
                            </span>
                        </div>
                    </div>
                );
            })}

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-warm/80"></div>
        </div>
    );
};

export default CloudBackground;
