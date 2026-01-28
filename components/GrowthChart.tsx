import React, { useMemo } from 'react';
import { GrowthRecord } from '../types';

interface GrowthChartProps {
    records: GrowthRecord[];
}

const GrowthChart: React.FC<GrowthChartProps> = ({ records }) => {
    const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

    const data = useMemo(() => {
        return [...records]
            .filter(r => r.height !== undefined || r.weight !== undefined)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [records]);

    if (data.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center h-48 md:h-64 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/40">
                <span className="material-symbols-outlined text-text-muted/40 text-4xl mb-2">analytics</span>
                <p className="text-text-muted font-sans italic text-sm md:text-base">数据不足，无法生成趋势图</p>
            </div>
        );
    }

    const padding = 60;
    const width = 800;
    const height = 400;

    // Height range (Left Axis)
    const heights = data.map(d => d.height || 0).filter(h => h > 0);
    const minH = Math.min(...heights) * 0.98;
    const maxH = Math.max(...heights) * 1.02;
    const rangeH = (maxH - minH) || 1;

    // Weight range (Right Axis)
    const weights = data.map(d => d.weight || 0).filter(w => w > 0);
    const minW = Math.min(...weights) * 0.95;
    const maxW = Math.max(...weights) * 1.05;
    const rangeW = (maxW - minW) || 1;

    const getTime = (date: string) => new Date(date).getTime();
    const minTime = getTime(data[0].date);
    const maxTime = getTime(data[data.length - 1].date);
    const timeRange = maxTime - minTime || 1;

    const getPoints = (type: 'height' | 'weight', min: number, range: number) => {
        return data
            .filter(d => d[type] !== undefined)
            .map(d => {
                const x = padding + ((getTime(d.date) - minTime) / timeRange) * (width - 2 * padding);
                const y = height - padding - (((d[type] as number) - min) / range) * (height - 2 * padding);
                return { x, y, value: d[type], date: d.date };
            });
    };

    const hPoints = getPoints('height', minH, rangeH);
    const wPoints = getPoints('weight', minW, rangeW);

    const getCurve = (points: any[]) => {
        if (points.length < 2) return '';
        return points.reduce((acc, p, i, arr) => {
            if (i === 0) return `M ${p.x} ${p.y}`;
            const prev = arr[i - 1];
            const cp1x = prev.x + (p.x - prev.x) / 2;
            const cp1y = prev.y;
            const cp2x = prev.x + (p.x - prev.x) / 2;
            const cp2y = p.y;
            return `${acc} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p.x} ${p.y}`;
        }, '');
    };

    const hCurve = getCurve(hPoints);
    const wCurve = getCurve(wPoints);

    return (
        <div className="w-full overflow-x-auto scrollbar-hide py-4 -mx-2 px-2">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto select-none"
                onMouseLeave={() => setActiveIdx(null)}
            >
                <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                        <feOffset dx="0" dy="2" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.3" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                    const y = height - padding - p * (height - 2 * padding);
                    const valH = (minH + p * rangeH).toFixed(1);
                    const valW = (minW + p * rangeW).toFixed(1);
                    return (
                        <g key={i}>
                            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(0,0,0,0.03)" />
                            <text x={padding - 10} y={y + 5} textAnchor="end" className="fill-[#FF94B4] text-[10px] font-bold hidden md:block">{valH}cm</text>
                            <text x={width - padding + 10} y={y + 5} textAnchor="start" className="fill-[#94D4FF] text-[10px] font-bold hidden md:block">{valW}kg</text>
                        </g>
                    );
                })}

                {/* Curves */}
                <path d={hCurve} fill="none" stroke="#FF94B4" strokeWidth="4" strokeLinecap="round" className="drop-shadow-md" />
                <path d={wCurve} fill="none" stroke="#94D4FF" strokeWidth="4" strokeLinecap="round" className="drop-shadow-md" />

                {/* Vertical Indicator Line */}
                {activeIdx !== null && (
                    <line
                        x1={hPoints[activeIdx]?.x || wPoints[activeIdx]?.x}
                        y1={padding}
                        x2={hPoints[activeIdx]?.x || wPoints[activeIdx]?.x}
                        y2={height - padding}
                        stroke="rgba(0,0,0,0.1)"
                        strokeDasharray="4 4"
                    />
                )}

                {/* Interaction Markers & Combined Labels */}
                {data.map((d, i) => {
                    const hp = hPoints.find(p => p.date === d.date);
                    const wp = wPoints.find(p => p.date === d.date);
                    const x = hp?.x || wp?.x || 0;
                    const isActive = activeIdx === i;

                    return (
                        <g
                            key={i}
                            onMouseEnter={() => setActiveIdx(i)}
                            onTouchStart={() => setActiveIdx(i)}
                            className="cursor-pointer"
                        >
                            {/* Hitbox */}
                            <rect x={x - 15} y={padding} width="30" height={height - 2 * padding} fill="transparent" />

                            {/* Markers */}
                            {hp && <circle cx={hp.x} cy={hp.y} r={isActive ? 8 : 5} fill="white" stroke="#FF94B4" strokeWidth="3" className="transition-all" />}
                            {wp && <circle cx={wp.x} cy={wp.y} r={isActive ? 8 : 5} fill="white" stroke="#94D4FF" strokeWidth="3" className="transition-all" />}

                            {/* Combined Floating Label */}
                            {isActive && (
                                <g filter="url(#shadow)">
                                    <rect
                                        x={x - 70}
                                        y={Math.min(hp?.y ?? 999, wp?.y ?? 999) - 70}
                                        width="140"
                                        height="50"
                                        rx="12"
                                        fill="white"
                                        className="opacity-95"
                                    />
                                    <text
                                        x={x}
                                        y={Math.min(hp?.y ?? 999, wp?.y ?? 999) - 48}
                                        textAnchor="middle"
                                        className="fill-text-soft font-serif italic font-bold text-sm"
                                    >
                                        {new Date(d.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })} 记录
                                    </text>
                                    <text
                                        x={x}
                                        y={Math.min(hp?.y ?? 999, wp?.y ?? 999) - 28}
                                        textAnchor="middle"
                                        className="font-sans font-black text-base"
                                    >
                                        <tspan fill="#FF94B4">{d.height}cm</tspan>
                                        <tspan fill="#ccc" dx="4"> / </tspan>
                                        <tspan fill="#94D4FF" dx="4">{d.weight}kg</tspan>
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* X-Axis Dates (Base) */}
                {hPoints.map((p, i) => (
                    <text key={i} x={p.x} y={height - padding + 25} textAnchor="middle" className="fill-text-muted/40 text-[10px] font-sans hidden md:block">
                        {new Date(p.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </text>
                ))}
            </svg>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF94B4]"></div>
                    <span className="text-sm text-text-muted">身高 (cm)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#94D4FF]"></div>
                    <span className="text-sm text-text-muted">体重 (kg)</span>
                </div>
            </div>
        </div>
    );
};

export default GrowthChart;
