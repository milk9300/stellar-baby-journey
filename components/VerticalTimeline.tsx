import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CloudBackground from './CloudBackground';
import Navbar from './Navbar';
import MemoryEditor from './MemoryEditor';
import TimePortal from './TimePortal';
import PhotoGallery from './PhotoGallery';
import ConfirmModal from './ConfirmModal';
import Balloon from './Balloon';
import CursorFollower from './CursorFollower';
import { Milestone } from '../types';
import { getAllMilestones, saveMilestone, deleteMilestone as removeFromStorage } from '../utils/storage';

const initialMilestones: Milestone[] = [
    {
        date: "2023年11月12日",
        title: "降临人间",
        description: "一个小奇迹诞生了，永远改变了我们的世界。欢迎回家，亲爱的小宝贝。",
        imgs: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCoVNfCrvxDWC1ejaJJU0dJn9MIfDsf2AcoZ0G5xbYkpyd7HJlHQ5WNKzFyzS1o8fz1nvJ47cwRB6yJCC6eVfRGyiAHZSVHHEYfbbRRGhm1clDTlxS5XO7I_0Cf95Md9EtkFiGBDPTDxMHG6rIl0e0rK-CYnh2vUCpRp1cmNl_OzMp1GZ4JwtUj691B2JwMWlTe-tIVBGb5sLegC9fXDyXPlcpoNw9dize9rhMO7hyLopWPIN_nhWfIOzZrUAaxli5YC_iASQeAHdtR"],
        reverse: false,
        delay: "0s"
    },
    {
        date: "2024年1月20日",
        title: "第一次甜美微笑",
        description: "天空中最明亮的星。只要看你一眼，整个世界都变得灿烂。",
        imgs: ["https://lh3.googleusercontent.com/aida-public/AB6AXuB37ZJ3FEEfESQSp6I9q4A8bbj4w8fomkRQIJfoqrYoQKAnjI9gWXa5cJe0lJHHFTQQqDYm987JB83R5ssiXi4zOyeFzUVIKpV1SrJ_dsKawh2e8qPRoaAzVlWgoWmjJiKKjkv8icJAbiwFAaGNA5uSlR_lQlX-Cp2tibhlCOmT5F_lsqnWgJ_D6UB0RRVYHIIgupfnMTa46nJudsH9KcoJ62B3POZvCMAyG9Ntc5bEKTw6Zfr2r4pJmLcrjmi3d1N0bk998OQ398H-"],
        reverse: true,
        delay: "1s"
    }
];

const VerticalTimeline: React.FC = () => {
    const navigate = useNavigate();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
    const [isManagementMode, setIsManagementMode] = useState(false);
    const [filter, setFilter] = useState<{ year: number | null, month: number | null }>({ year: null, month: null });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [scrollAltitude, setScrollAltitude] = useState(0);
    const [newlyAddedId, setNewlyAddedId] = useState<number | null>(null);

    // Long Press State
    const [pressingId, setPressingId] = useState<number | null>(null);
    const [pressProgress, setPressProgress] = useState(0);
    const pressTimer = useRef<NodeJS.Timeout | null>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    const loadData = async () => {
        const data = await getAllMilestones();
        if (data.length === 0) {
            for (const m of initialMilestones) {
                await saveMilestone(m);
            }
            const seeded = await getAllMilestones();
            setMilestones(seeded);
        } else {
            const sortedData = data.sort((a, b) => {
                const dateA = a.date ? new Date(a.date.replace(/年|月|日/g, '-').replace(/-$/, '')).getTime() : 0;
                const dateB = b.date ? new Date(b.date.replace(/年|月|日/g, '-').replace(/-$/, '')).getTime() : 0;
                return dateA - dateB;
            });
            setMilestones(sortedData);
        }
    };

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

    useEffect(() => {
        loadData();

        const handleScroll = () => {
            const position = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const altitude = Math.max(0, Math.floor((maxScroll - position) / 10));
            setScrollAltitude(altitude);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSaveMemory = async (data: Milestone) => {
        const isNew = !data.id;
        const savedId = await saveMilestone(data);
        await loadData();

        if (isNew && savedId) {
            setNewlyAddedId(savedId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setNewlyAddedId(null), 3500);
        }
    };

    const handleDelete = (id: number) => {
        setDeletingId(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (deletingId !== null) {
            await removeFromStorage(deletingId);
            loadData();
        }
        setIsConfirmOpen(false);
        setDeletingId(null);
    };

    const handleFilterChange = (year: number | null, month: number | null) => {
        setFilter({ year, month });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLongPressStart = (id: number) => {
        if (isEditorOpen) return;
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

    const displayMilestones = [...filteredMilestones].reverse();

    return (
        <div className="relative min-h-screen bg-transparent">
            <CloudBackground />
            <CursorFollower progress={pressProgress} isActive={!!pressingId} />
            <Navbar title="伊芙琳的成长日记" />

            <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group flex flex-col items-center gap-2 mb-4 hover:scale-110 transition-all"
                    title="飞向云端"
                >
                    <span className="font-handwritten text-lg text-primary/60">飞向云端</span>
                    <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                        <span className="material-symbols-outlined">north</span>
                    </div>
                </button>

                <div className="h-64 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent relative">
                    <div
                        className="absolute w-4 h-4 bg-primary rounded-full -left-[7px] shadow-lg shadow-primary/40 transition-all duration-300"
                        style={{ top: `${100 - Math.min(100, (scrollAltitude / 500) * 100)}%` }}
                    >
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap">
                            <span className="font-handwritten text-2xl text-primary">当前海拔: {scrollAltitude}m</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
                    className="group flex flex-col items-center gap-2 mt-4 hover:scale-110 transition-all"
                    title="降落地面"
                >
                    <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                        <span className="material-symbols-outlined">south</span>
                    </div>
                    <span className="font-handwritten text-lg text-primary/60">降落地面</span>
                </button>
            </div>

            <div className="fixed top-8 left-8 z-50 flex flex-col items-start gap-2">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full shadow-xl border border-primary/20 transition-all hover:bg-white/95">
                    <span className="font-handwritten text-xl text-text-muted">编辑模式</span>
                    <button
                        onClick={() => setIsManagementMode(!isManagementMode)}
                        className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${isManagementMode ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isManagementMode ? 'translate-x-6' : ''}`}></div>
                    </button>
                </div>
                {isManagementMode && (
                    <div className="ml-4 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="font-handwritten text-lg text-primary/70 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/60 shadow-sm">
                            浏览记得关闭哦 ✨
                        </span>
                    </div>
                )}
            </div>

            <main className="relative z-10 pt-40 pb-60 max-w-6xl mx-auto px-6">
                <header className="text-center mb-32">
                    <h2 className="font-handwritten text-5xl mb-6 text-primary animate-float">一段美丽的旅程开始了...</h2>
                    <h3 className="text-5xl md:text-7xl font-serif italic mb-8 text-text-soft leading-tight">宝宝的<br />成长气球之旅</h3>
                    <p className="max-w-xl mx-auto text-text-muted font-normal text-lg leading-relaxed">
                        在成长的云端漂浮，记录宝贝的每一次欢笑和每一个里程碑。
                    </p>
                </header>

                <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 blur-[1px]"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/40 z-0"></div>

                    {displayMilestones.map((m, idx) => {
                        const images = m.imgs || ((m as any).img ? [(m as any).img] : []);
                        const isEven = idx % 2 === 0;

                        return (
                            <div key={m.id || idx} className={`relative flex ${isEven ? 'flex-row-reverse' : ''} items-center justify-between mb-48 w-full group`}>
                                <div className={`w-5/12 ${isEven ? 'text-left pl-12' : 'text-right pr-12'}`}>
                                    <span className="text-xl font-handwritten text-primary mb-2 block">{m.date}</span>
                                    <h4 className="text-3xl font-serif italic mb-4 text-text-soft group-hover:text-primary transition-colors">{m.title}</h4>
                                    <p className="text-text-muted font-sans text-lg leading-relaxed">{m.description}</p>
                                </div>

                                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg z-20 flex items-center justify-center border-2 border-primary/30">
                                    <span className="material-symbols-outlined text-primary text-sm">favorite</span>
                                    <div className="absolute inset-0 rounded-full animate-pulse-warm bg-primary/20"></div>
                                </div>

                                <div className={`w-5/12 ${isEven ? 'pr-12' : 'pl-12'} relative`}>
                                    <div className={`absolute -top-24 ${isEven ? 'right-12' : 'left-12'} flex gap-2 pointer-events-none`}>
                                        <Balloon color="#f4a29e" size={45} delay="0s" />
                                        <Balloon color="#ffdac1" size={35} delay="0.5s" className="-mt-4" />
                                        <Balloon color="#baffc9" size={40} delay="1.2s" className="-mt-2" />
                                    </div>

                                    <div
                                        onMouseDown={() => m.id && handleLongPressStart(m.id)}
                                        onMouseUp={handleLongPressEnd}
                                        onMouseLeave={handleLongPressEnd}
                                        onTouchStart={() => m.id && handleLongPressStart(m.id)}
                                        onTouchEnd={handleLongPressEnd}
                                        className={`relative p-3 bg-white shadow-2xl rounded-sm rotate-${isEven ? '2' : '-2'} transition-all duration-700 hover:rotate-0 hover:scale-[1.03] border border-gray-100 group/card ${m.id === newlyAddedId ? 'animate-launch z-50' : ''} ${pressingId === m.id ? 'animate-vibrate cursor-none' : 'cursor-pointer'}`}
                                        style={{ animationDelay: m.id === newlyAddedId ? '0s' : `${idx * 0.5}s` }}
                                    >
                                        {pressingId === m.id && (
                                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary/10 z-50 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${pressProgress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                        <div className="relative overflow-hidden aspect-[4/5] bg-gray-50 rounded-sm pointer-events-none">
                                            <PhotoGallery
                                                images={images}
                                                title={m.title}
                                                isManagementMode={isManagementMode}
                                                onEdit={() => { setEditingMilestone(m); setIsEditorOpen(true); }}
                                                onDelete={() => handleDelete(m.id!)}
                                            />
                                        </div>
                                        <div className="mt-4 pb-2 text-center">
                                            <span className="font-handwritten text-3xl text-text-soft italic">{m.title}</span>
                                        </div>
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-primary/30 backdrop-blur-sm -rotate-2"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <footer className="mt-40 text-center relative">
                    <button
                        onClick={() => { setEditingMilestone(null); setIsEditorOpen(true); }}
                        className="group relative inline-flex items-center justify-center w-20 h-20 bg-primary text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-20"
                    >
                        <span className="material-symbols-outlined text-3xl">add</span>
                        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white text-primary px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-handwritten text-xl border border-primary/10">
                            添加新的里程碑
                        </div>
                    </button>
                    <div className="w-1 absolute bottom-full left-1/2 -translate-x-1/2 h-20 bg-gradient-to-t from-primary/40 to-transparent border-l-2 border-dashed border-primary/20"></div>
                </footer>
            </main>

            <TimePortal
                onFilterChange={handleFilterChange}
                availableYears={availableYears}
            />

            <MemoryEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSave={handleSaveMemory}
                initialData={editingMilestone}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="撕掉这一页？"
                message="确定要从绘本里撕掉这一页吗？这段珍贵的记忆将不再显示。"
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
};

export default VerticalTimeline;
