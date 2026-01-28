import React, { useMemo } from 'react';
import { GrowthRecord } from '../types';

interface GrowthChartProps {
    records: GrowthRecord[];
}

const GrowthChart: React.FC<GrowthChartProps> = ({ records }) => {
    const data = useMemo(() => {
        return [...records]
            .filter(r => r.height !== undefined || r.weight !== undefined)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [records]);

    if (data.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/40">
                <span className="material-symbols-outlined text-text-muted/40 text-4xl mb-2">analytics</span>
                <p className="text-text-muted font-sans italic">数据不足，无法生成趋势图</p>
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
        <div className="w-full overflow-x-auto scrollbar-hide py-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[700px] h-full">
                <defs>
                    <linearGradient id="grad-h" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF94B4" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#FF94B4" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="grad-w" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94D4FF" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#94D4FF" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                    const y = height - padding - p * (height - 2 * padding);
                    const valH = (minH + p * rangeH).toFixed(1);
                    const valW = (minW + p * rangeW).toFixed(1);
                    return (
                        <g key={i}>
                            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(0,0,0,0.03)" />
                            {/* Left Axis (Height) */}
                            <text x={padding - 10} y={y + 5} textAnchor="end" className="fill-[#FF94B4] text-[10px] font-bold">{valH}cm</text>
                            {/* Right Axis (Weight) */}
                            <text x={width - padding + 10} y={y + 5} textAnchor="start" className="fill-[#94D4FF] text-[10px] font-bold">{valW}kg</text>
                        </g>
                    );
                })}

                {/* Curves */}
                <path d={hCurve} fill="none" stroke="#FF94B4" strokeWidth="4" strokeLinecap="round" className="drop-shadow-md" />
                <path d={wCurve} fill="none" stroke="#94D4FF" strokeWidth="4" strokeLinecap="round" className="drop-shadow-md" />

                {/* Points */}
                {hPoints.map((p, i) => (
                    <g key={`h-${i}`} className="group cursor-pointer">
                        <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#FF94B4" strokeWidth="2" className="transition-all group-hover:r-7" />
                        <text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-text-soft text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {p.value}cm
                        </text>
                    </g>
                ))}
                {wPoints.map((p, i) => (
                    <g key={`w-${i}`} className="group cursor-pointer">
                        <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#94D4FF" strokeWidth="2" className="transition-all group-hover:r-7" />
                        <text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-text-soft text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {p.value}kg
                        </text>
                    </g>
                ))}

                {/* X-Axis Dates */}
                {hPoints.map((p, i) => (
                    <text key={i} x={p.x} y={height - padding + 25} textAnchor="middle" className="fill-text-muted/60 text-[10px] font-sans">
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
