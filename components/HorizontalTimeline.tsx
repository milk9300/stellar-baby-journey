import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CloudBackground from './CloudBackground';
import Navbar from './Navbar';
import PhotoGallery from './PhotoGallery';
import { Milestone } from '../types';
import { getAllMilestones } from '../utils/storage';
import TimePortal from './TimePortal';
import Balloon from './Balloon';
import CursorFollower from './CursorFollower';

const HorizontalTimeline: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [filter, setFilter] = useState<{ year: number | null, month: number | null }>({ year: null, month: null });

    // Long Press State
    const [pressingId, setPressingId] = useState<number | null>(null);
    const [pressProgress, setPressProgress] = useState(0);
    const pressTimer = useRef<NodeJS.Timeout | null>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    const loadData = async () => {
        const data = await getAllMilestones();
        const sortedData = data.sort((a, b) => {
            const dateA = a.date ? new Date(a.date.replace(/年|月|日/g, '-').replace(/-$/, '')).getTime() : 0;
            const dateB = b.date ? new Date(b.date.replace(/年|月|日/g, '-').replace(/-$/, '')).getTime() : 0;
            return dateA - dateB;
        });
        setMilestones(sortedData);
    };

    useEffect(() => {
        loadData();

        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            // Increase move speed and handle both X and Y deltas
            const scrollAmount = (e.deltaY + e.deltaX) * 1.5;
            container.scrollLeft += scrollAmount;
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
        const progress = scrollWidth > clientWidth ? (scrollLeft / (scrollWidth - clientWidth)) * 100 : 0;
        setScrollProgress(progress);
    };

    const handleFilterChange = (year: number | null, month: number | null) => {
        setFilter({ year, month });
        if (containerRef.current) {
            containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    };

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        milestones.forEach(m => {
            if (m.date) {
                const cleanDate = m.date.replace(/年|月|日/g, '-').replace(/-$/, '');
                const date = new Date(cleanDate);
                if (!isNaN(date.getTime())) years.add(date.getFullYear());
            }
        });
        return Array.from(years).sort((a, b) => a - b);
    }, [milestones]);

    const filteredMilestones = useMemo(() => {
        return milestones.filter(m => {
            if (!m.date) return true;
            const cleanDate = m.date.replace(/年|月|日/g, '-').replace(/-$/, '');
            const date = new Date(cleanDate);
            if (isNaN(date.getTime())) return true;

            const matchesYear = filter.year === null || date.getFullYear() === filter.year;
            const matchesMonth = filter.month === null || date.getMonth() === filter.month;
            return matchesYear && matchesMonth;
        });
    }, [milestones, filter]);

    const handleLongPressStart = (id: number) => {
        setPressingId(id);
        setPressProgress(0);

        const startTime = Date.now();
        const duration = 2000;

        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setPressProgress(progress);
        }, 50);

        pressTimer.current = setTimeout(() => {
            if (progressInterval.current) clearInterval(progressInterval.current);
            setPressingId(null);
            setPressProgress(0);
            navigate(`/memory/${id}`);
        }, duration);
    };

    const handleLongPressEnd = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
        if (progressInterval.current) clearInterval(progressInterval.current);
        setPressingId(null);
        setPressProgress(0);
    };

    return (
        <div className="relative h-screen bg-transparent overflow-hidden flex flex-col">
            <CloudBackground />
            <CursorFollower progress={pressProgress} isActive={!!pressingId} />
            <Navbar title="伊芙琳的全景图" />

            <div className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-40 bg-white/40 backdrop-blur-md px-5 py-2 md:px-8 md:py-3 rounded-full border border-white/60 shadow-xl flex items-center gap-3 md:gap-4 scale-90 md:scale-100">
                <span className="font-handwritten text-lg md:text-xl text-primary whitespace-nowrap">已探索里程: {Math.floor(scrollProgress * 10)}km</span>
                <div className="w-20 md:w-32 h-1.5 md:h-2 bg-primary/10 rounded-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
                </div>
            </div>

            <main
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-x-auto overflow-y-hidden flex items-center scrollbar-hide touch-pan-x"
                style={{ scrollBehavior: 'auto' }}
            >
                <div className="flex h-full min-w-max items-center px-[8vw] md:px-[20vw] gap-16 md:gap-32">
                    <section className="min-w-[70vw] md:min-w-[40vw] flex flex-col items-center justify-center">
                        <div className="relative group scale-75 md:scale-100">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <span className="material-symbols-outlined text-6xl text-primary/40">explore</span>
                        </div>
                        <h2 className="font-handwritten text-3xl md:text-4xl mt-8 md:mt-12 text-primary animate-pulse-warm text-center">那些被珍藏的瞬间…</h2>
                    </section>

                    {filteredMilestones.map((m, idx) => {
                        const images = m.imgs || ((m as any).img ? [(m as any).img] : []);

                        return (
                            <section key={m.id || idx} className="flex items-center relative group">
                                <div className="relative">
                                    <div className={`absolute -top-32 left-0 flex gap-2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700`}>
                                        <Balloon color="#f4a29e" size={40} delay="0s" />
                                        <Balloon color="#ffdac1" size={30} delay="0.5s" className="-mt-4" />
                                        <Balloon color="#baffc9" size={35} delay="1.2s" className="-mt-4" />
                                    </div>

                                    <div className="absolute -top-12 left-6 font-handwritten text-2xl text-primary/60 scale-90 md:scale-100">第 {idx + 1} 章</div>

                                    <div
                                        onMouseDown={() => m.id && handleLongPressStart(m.id)}
                                        onMouseUp={handleLongPressEnd}
                                        onMouseLeave={handleLongPressEnd}
                                        onTouchStart={() => m.id && handleLongPressStart(m.id)}
                                        onTouchEnd={handleLongPressEnd}
                                        className={`relative p-3 md:p-4 bg-white shadow-2xl rounded-sm rotate-${idx % 2 === 0 ? '1' : '-1'} group-hover:rotate-0 transition-transform duration-500 border border-gray-100 ${pressingId === m.id ? 'animate-vibrate cursor-none' : 'cursor-pointer'}`}
                                    >
                                        {pressingId === m.id && (
                                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary/10 z-50 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${pressProgress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                        <div className="w-[75vw] md:w-80 h-[350px] md:h-[400px] overflow-hidden bg-gray-50 rounded-sm relative pointer-events-none">
                                            <PhotoGallery
                                                images={images}
                                                title={m.title}
                                            />
                                        </div>
                                        <div className="mt-4 md:mt-6 text-center px-2">
                                            <h3 className="font-serif italic text-2xl md:text-4xl mb-2 md:mb-4 text-text-soft truncate">{m.title}</h3>
                                            <p className="font-sans text-base md:text-lg text-text-muted max-w-[240px] md:max-w-[280px] mx-auto leading-relaxed line-clamp-2 md:line-clamp-3">{m.description}</p>
                                        </div>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 md:w-16 h-5 md:h-6 bg-primary/20 backdrop-blur-sm -rotate-2 shadow-sm border border-white/40"></div>
                                    </div>

                                    <div className="absolute -right-[15.5vw] top-1/2 -translate-y-1/2 w-[16vw] h-1 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 blur-[1px] -z-10 group-hover:via-primary/40 transition-all duration-700"></div>
                                </div>
                            </section>
                        );
                    })}

                    <section className="min-w-[85vw] md:min-w-[60vw] flex flex-col items-start justify-center pr-10 md:pr-20">
                        <div className="p-8 md:p-16 rounded-[32px] md:rounded-[40px] bg-white/60 backdrop-blur-md border border-white/80 shadow-xl">
                            <h2 className="font-serif italic text-3xl md:text-5xl mb-4 md:mb-6 text-text-soft">画卷缓缓展开...</h2>
                            <p className="font-sans text-text-muted mb-6 md:mb-8 max-w-xs md:max-w-md text-lg md:text-xl">每一章都是全新的冒险，而我们才刚刚启程。感谢你成为我们故事的一部分。</p>
                            <div className="flex gap-4 md:gap-6">
                                <button
                                    onClick={() => containerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })}
                                    className="bg-primary hover:bg-opacity-80 text-white px-8 py-3 md:px-10 md:py-4 rounded-full font-handwritten text-xl md:text-2xl font-bold transition-all flex items-center gap-2 shadow-md"
                                >
                                    回溯起点 <span className="material-symbols-outlined transition-transform">rocket_launch</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <TimePortal
                onFilterChange={handleFilterChange}
                availableYears={availableYears}
            />
        </div>
    );
};

export default HorizontalTimeline;
