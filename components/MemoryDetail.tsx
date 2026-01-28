import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Milestone } from '../types';
import { fetchMilestoneById, saveMilestone } from '../utils/storage';
import Navbar from './Navbar';
import PhotoGallery from './PhotoGallery';
import MemoryEditor from './MemoryEditor';

const MemoryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [milestone, setMilestone] = useState<Milestone | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!id) return;
        setLoading(true);
        const data = await fetchMilestoneById(parseInt(id));
        setMilestone(data || null);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleSave = async (data: Milestone) => {
        await saveMilestone(data);
        loadData();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-warm flex items-center justify-center">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary animate-pulse">favorite</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!milestone) {
        return (
            <div className="min-h-screen bg-background-warm flex flex-col items-center justify-center gap-6 p-6 text-center">
                <div className="w-32 h-32 rounded-full bg-white/80 shadow-inner flex items-center justify-center mb-4">
                    <span className="text-6xl text-primary/40 material-symbols-outlined">cloud_off</span>
                </div>
                <h3 className="text-3xl font-serif italic text-text-soft">这段记忆漂浮太远了...</h3>
                <p className="text-text-muted max-w-xs leading-relaxed">我们无法在当前的云端找到它。可能是风把它带到了别的星系。</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-10 py-4 bg-primary text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all font-handwritten text-2xl"
                >
                    降落地面
                </button>
            </div>
        );
    }

    const images = milestone.imgs || ((milestone as any).img ? [(milestone as any).img] : []);

    return (
        <div className="min-h-screen bg-background-warm selection:bg-primary/10">
            <Navbar title="时光珍藏" />

            <main className="max-w-6xl mx-auto pt-32 pb-40 px-6">
                <header className="mb-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-text-muted hover:text-primary transition-all pr-6 py-2"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/60 shadow-md flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">west</span>
                        </div>
                        <span className="font-handwritten text-2xl">漫步时光</span>
                    </button>

                    <div className="flex flex-col items-end">
                        <span className="font-serif italic text-primary/40 uppercase tracking-[0.3em] text-xs mb-1">Recorded on</span>
                        <div className="font-handwritten text-2xl text-text-soft">{milestone.date}</div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Left Side: Polaroid Experience (Cols 1-7) */}
                    <div className="lg:col-span-7 relative group">
                        {/* Decorative background glow */}
                        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,rgba(244,162,158,0.15),transparent_70%)] pointer-events-none"></div>

                        <div className="bg-white p-5 md:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm rotate-1 transition-all duration-700 hover:rotate-0 hover:scale-[1.01] border border-gray-100 relative">
                            {/* Tape Decoration */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-10 bg-primary/10 backdrop-blur-sm -rotate-2 border border-white/40 shadow-sm z-20"></div>

                            <div className="aspect-[4/5] bg-stone-50 overflow-hidden relative rounded-sm shadow-inner cursor-zoom-in">
                                <PhotoGallery images={images} title={milestone.title} />
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full text-xs text-text-muted border border-white/60">点击探索细节 ✨</span>
                                </div>
                            </div>

                            <div className="mt-10 mb-2 px-4">
                                <h1 className="font-serif italic text-4xl md:text-5xl text-text-soft mb-4 leading-tight">
                                    {milestone.title}
                                </h1>
                            </div>
                        </div>

                        {/* Staggered Shadow Photos (Visual Flourish) */}
                        <div className="absolute -z-10 top-10 right-0 w-32 h-40 bg-white/40 border border-white shadow-xl rotate-12 opacity-30 pointer-events-none"></div>
                        <div className="absolute -z-10 bottom-20 -left-10 w-40 h-32 bg-white/40 border border-white shadow-xl -rotate-12 opacity-30 pointer-events-none"></div>
                    </div>

                    {/* Right Side: Narrative & Memory Journal (Cols 8-12) */}
                    <div className="lg:col-span-5 flex flex-col gap-10">
                        <section className="bg-white/50 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl border border-white/80 relative overflow-hidden flex flex-col min-h-[400px]">
                            {/* Watermark/Icon */}
                            <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[12rem] text-primary/5 select-none pointer-events-none">
                                menu_book
                            </span>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1.5 h-10 bg-primary/20 rounded-full"></div>
                                <h2 className="font-serif text-xl text-primary/60 uppercase tracking-[0.4em] font-bold">记忆碎语</h2>
                            </div>

                            <div className="flex-1">
                                <p className="font-serif text-text-soft text-2xl md:text-3xl leading-[1.8] italic relative z-10 first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-primary/40">
                                    {milestone.description}
                                </p>
                            </div>

                            <div className="mt-12 flex items-center gap-4 text-text-muted/40 font-handwritten text-xl">
                                <span className="material-symbols-outlined text-sm">edit_note</span>
                                每一刻都值得被记录
                            </div>
                        </section>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsEditorOpen(true)}
                                className="col-span-2 group py-6 bg-primary text-white rounded-[24px] shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 font-serif italic text-xl overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                <span className="material-symbols-outlined text-2xl">auto_fix_high</span>
                                <span className="relative z-10">再次润色这段记忆</span>
                            </button>

                            <div className="col-span-2 p-8 bg-white/20 rounded-[32px] border border-white/60 shadow-sm">
                                <div className="flex items-center gap-3 mb-4 text-primary font-bold tracking-widest text-xs uppercase">
                                    <span className="material-symbols-outlined text-base">tips_and_updates</span>
                                    <span>温情贴士</span>
                                </div>
                                <p className="text-text-muted text-lg leading-relaxed font-serif italic opacity-80">
                                    点击左侧的岁月画框可以捕捉更多细节。如果您想在这段时光里添加更多剪影，请点击“润色”按钮。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <MemoryEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSave={handleSave}
                initialData={milestone}
            />
        </div>
    );
};

export default MemoryDetail;
