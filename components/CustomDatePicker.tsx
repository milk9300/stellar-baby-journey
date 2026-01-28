import React, { useState, useRef, useEffect } from 'react';

interface CustomDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    className?: string;
    placeholder?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, className, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Ensure viewDate is valid, fallback to today
    if (isNaN(viewDate.getTime())) {
        setViewDate(new Date());
    }

    // Sync viewDate when opening if value exists
    useEffect(() => {
        if (isOpen && value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setViewDate(date);
            }
        }
    }, [isOpen]);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handleDateClick = (day: number) => {
        const year = viewDate.getFullYear();
        const month = String(viewDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        onChange(`${year}-${month}-${dayStr}`);
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const changeYear = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear() + offset, viewDate.getMonth(), 1));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const days = [];
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    // Padding for first week (treating Sunday as 0)
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-8 md:h-10"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
        const isSelected = value === `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), d).toDateString();

        days.push(
            <button
                key={d}
                type="button"
                onClick={() => handleDateClick(d)}
                className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-sm md:text-base transition-all
                    ${isSelected ? 'bg-primary text-white shadow-md scale-110' : 'hover:bg-primary/10 text-text-soft'}
                    ${isToday && !isSelected ? 'border-2 border-primary/30 font-bold' : ''}
                `}
            >
                {d}
            </button>
        );
    }

    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    return (
        <div className="relative" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between cursor-pointer ${className}`}
            >
                <span className={value ? 'text-text-soft' : 'text-text-muted font-sans'}>
                    {value || placeholder || '选择日期'}
                </span>
                <span className="material-symbols-outlined text-primary/60 text-xl md:text-2xl">calendar_today</span>
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 z-[110] bg-[#fffaf0] border-2 border-primary/20 rounded-[24px] shadow-2xl p-4 w-[280px] md:w-[320px] animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:bg-primary/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-primary">chevron_left</span>
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="font-serif italic text-lg text-text-soft">
                                {viewDate.getFullYear()}年 {viewDate.getMonth() + 1}月
                            </span>
                        </div>
                        <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:bg-primary/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-primary">chevron_right</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(d => (
                            <div key={d} className="h-8 flex items-center justify-center text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-tighter">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days}
                    </div>

                    <div className="mt-4 pt-3 border-t border-primary/10 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date();
                                onChange(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
                                setIsOpen(false);
                            }}
                            className="text-xs md:text-sm font-handwritten text-primary hover:underline"
                        >
                            回到今天
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-xs md:text-sm text-text-muted hover:text-text-soft"
                        >
                            关闭
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
