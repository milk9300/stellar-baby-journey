import React from 'react';

interface BalloonProps {
    color?: string;
    size?: number;
    className?: string;
    delay?: string;
}

const Balloon: React.FC<BalloonProps> = ({
    color = '#ff9a9e',
    size = 40,
    className = '',
    delay = '0s'
}) => {
    const id = React.useId().replace(/:/g, '');

    return (
        <div
            className={`relative flex flex-col items-center animate-balloon ${className}`}
            style={{ animationDelay: delay }}
        >
            {/* Balloon Body */}
            <svg
                width={size}
                height={size * 1.25}
                viewBox="0 0 100 125"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm"
            >
                <path
                    d="M50 0C25 0 0 20 0 50C0 80 50 100 50 100C50 100 100 80 100 50C100 20 75 0 50 0Z"
                    fill={`url(#balloon-grad-${id})`}
                    fillOpacity="0.8"
                />
                <circle cx="30" cy="25" r="8" fill="white" fillOpacity="0.3" />
                <defs>
                    <radialGradient id={`balloon-grad-${id}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35 30) rotate(90) scale(70)">
                        <stop stopColor="white" stopOpacity="0.4" />
                        <stop offset="1" stopColor={color} />
                    </radialGradient>
                </defs>
            </svg>

            {/* Balloon String */}
            <div
                className="w-[1px] h-20 bg-primary/20 -mt-1 origin-top animate-string"
                style={{ animationDelay: delay }}
            ></div>
        </div>
    );
};

export default Balloon;
