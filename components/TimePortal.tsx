import React, { useState } from 'react';

interface TimePortalProps {
    onFilterChange: (year: number | null, month: number | null) => void;
    availableYears: number[];
}

const TimePortal: React.FC<TimePortalProps> = ({ onFilterChange, availableYears }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    const months = [
        { name: '一月', value: 0 }, { name: '二月', value: 1 }, { name: '三月', value: 2 },
        { name: '四月', value: 3 }, { name: '五月', value: 4 }, { name: '六月', value: 5 },
        { name: '七月', value: 6 }, { name: '八月', value: 7 }, { name: '九月', value: 8 },
        { name: '十月', value: 9 }, { name: '十一月', value: 10 }, { name: '十二月', value: 11 }
    ];

    const handleYearSelect = (year: number | null) => {
        setSelectedYear(year);
        onFilterChange(year, selectedMonth);
    };

    const handleMonthSelect = (month: number | null) => {
        setSelectedMonth(month);
        onFilterChange(selectedYear, month);
    };

    return (
        <div className="fixed bottom-28 right-10 z-[1100] flex flex-col items-end gap-4">
            {/* Filter Panel */}
            {isOpen && (
                <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-[32px] shadow-2xl border border-white/80 w-80 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
                    <div className="mb-6">
                        <h3 className="text-primary font-serif italic text-xl mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">calendar_month</span> 年份选择
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleYearSelect(null)}
                                className={`px-4 py-2 rounded-full text-sm transition-all ${selectedYear === null ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}
                            >
                                全部
                            </button>
                            {availableYears.sort((a, b) => b - a).map(year => (
                                <button
                                    key={year}
                                    onClick={() => handleYearSelect(year)}
                                    className={`px-4 py-2 rounded-full text-sm transition-all ${selectedYear === year ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}
                                >
                                    {year}年
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-primary font-serif italic text-xl mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">routine</span> 月份浏览
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => handleMonthSelect(null)}
                                className={`col-span-3 py-2 rounded-2xl text-sm transition-all ${selectedMonth === null ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}
                            >
                                全年显示
                            </button>
                            {months.map(m => (
                                <button
                                    key={m.value}
                                    onClick={() => handleMonthSelect(m.value)}
                                    className={`py-2 rounded-2xl text-xs transition-all ${selectedMonth === m.value ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-2 ${isOpen
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white/40 backdrop-blur-md border-white/60 text-primary hover:bg-white/60'}`}
                title="星空导航"
            >
                <span className={`material-symbols-outlined text-3xl transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? 'close' : 'explore'}
                </span>
            </button>
        </div>
    );
};

export default TimePortal;
