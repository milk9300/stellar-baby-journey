import React, { useState, useEffect, useMemo } from 'react';
import { GrowthRecord, Milestone } from '../types';
import { getAllGrowthRecords, getAllMilestones, saveGrowthRecord, deleteGrowthRecord } from '../utils/storage';
import Navbar from './Navbar';
import GrowthChart from './GrowthChart';
import GrowthEditor from './GrowthEditor';
import ConfirmModal from './ConfirmModal';

const GrowthArchive: React.FC = () => {
    const [records, setRecords] = useState<GrowthRecord[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<GrowthRecord | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadData = async () => {
        const [gData, mData] = await Promise.all([
            getAllGrowthRecords(),
            getAllMilestones()
        ]);
        setRecords(gData);
        setMilestones(mData);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (record: Partial<GrowthRecord>) => {
        await saveGrowthRecord(record);
        loadData();
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (deletingId !== null) {
            await deleteGrowthRecord(deletingId);
            loadData();
        }
        setIsConfirmOpen(false);
        setDeletingId(null);
    };

    const sortedRecords = useMemo(() => {
        return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [records]);

    const latestRecord = sortedRecords[0] || null;
    const previousRecord = sortedRecords[1] || null;

    const getTrend = (key: keyof GrowthRecord, unit: string) => {
        if (!latestRecord || !previousRecord || latestRecord[key] === undefined || previousRecord[key] === undefined) {
            return '稳定发育中';
        }
        const diff = (latestRecord[key] as number) - (previousRecord[key] as number);
        if (diff === 0) return '持平于上次记录';
        const sign = diff > 0 ? '+' : '';
        return `比上次记录 ${diff > 0 ? '增长' : '减少'} 了 ${sign}${diff}${unit}`;
    };

    const stats = [
        {
            label: '当前身高',
            value: latestRecord?.height || '--',
            unit: 'cm',
            icon: 'straighten',
            color: 'text-primary',
            desc: getTrend('height', 'cm')
        },
        {
            label: '当前体重',
            value: latestRecord?.weight || '--',
            unit: 'kg',
            icon: 'fitness_center',
            color: 'text-blue-400',
            desc: getTrend('weight', 'kg')
        },
        {
            label: '乳牙数量',
            value: latestRecord?.toothCount ?? '0',
            unit: '颗',
            icon: 'sentiment_satisfied',
            color: 'text-orange-400',
            desc: getTrend('toothCount', '颗')
        },
        {
            label: '每日睡眠',
            value: latestRecord?.sleepHours || '--',
            unit: 'h',
            icon: 'bedtime',
            color: 'text-purple-400',
            desc: getTrend('sleepHours', 'h')
        },
    ];

    return (
        <div className="min-h-screen bg-background-warm pt-32 pb-20 px-6 sm:px-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <Navbar title="成长档案" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="text-center mb-16 relative">
                    <div className="inline-block px-4 py-1 bg-white/40 backdrop-blur-sm rounded-full text-primary text-sm font-sans mb-4 border border-white/60">
                        成长历程
                    </div>
                    <h1 className="font-serif italic text-6xl text-text-soft mb-6 tracking-tight">成长档案</h1>
                    <p className="text-text-muted text-xl font-sans max-w-2xl mx-auto leading-relaxed">
                        记录每一个小小的进步，将这些星光般的瞬间串联成最珍贵的回忆。
                    </p>

                    <button
                        onClick={() => { setEditingRecord(null); setIsEditorOpen(true); }}
                        className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all font-serif italic text-xl flex items-center gap-2 mx-auto"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        记录新的成长
                    </button>
                </header>

                {/* Main Visual: Growth Chart */}
                <section className="mb-16 bg-white/60 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/80">
                    <div className="mb-12">
                        <h2 className="text-3xl font-serif italic text-text-soft">成长趋势</h2>
                        <p className="text-text-muted mt-2 font-sans">身高与体重的同步增长，见证生命的奇迹。</p>
                    </div>

                    <div className="relative">
                        <GrowthChart records={records} />
                    </div>
                </section>

                {/* Physical Data Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 shadow-xl border border-white/80 hover:translate-y-[-8px] transition-all duration-300 group">
                            <div className={`p-4 rounded-2xl bg-white/80 shadow-inner w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <span className={`material-symbols-outlined ${stat.color} text-3xl`}>{stat.icon}</span>
                            </div>
                            <div className="text-text-muted text-sm font-sans mb-1 uppercase tracking-wider">{stat.label}</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-serif text-text-soft">{stat.value}</span>
                                <span className="text-text-muted font-sans font-light">{stat.unit}</span>
                            </div>
                            <div className="mt-6 pt-4 border-t border-primary/5 text-xs text-text-muted/60 italic font-sans">
                                {stat.desc}
                            </div>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Growth Insights */}
                    <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-[32px] p-8 shadow-xl border border-white/80">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                            <h2 className="text-2xl font-serif italic text-text-soft">成长寄语 & 健康贴士</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                <h3 className="font-serif italic text-lg text-primary mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">favorite</span> 身体发育
                                </h3>
                                <p className="text-text-muted leading-relaxed text-sm font-sans">
                                    宝贝目前正处于快速发育期。身高和体重都在理想范围内。
                                    请继续保持均衡的营养摄入，多接触自然光以助于钙质吸收。
                                </p>
                            </div>
                            <div className="p-6 bg-blue-400/5 rounded-3xl border border-blue-400/10">
                                <h3 className="font-serif italic text-lg text-blue-400 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">stars</span> 智力开启
                                </h3>
                                <p className="text-text-muted leading-relaxed text-sm font-sans">
                                    这段时间是语言和认知发展的黄金期。建议多给宝贝讲故事，
                                    听听轻柔的古典音乐，这些都会刺激大脑突触的生长。
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-white/40 rounded-3xl border border-white/60 italic text-text-muted/80 text-center font-handwritten text-xl leading-relaxed">
                            “生命是一场漫长的修行，而你的每一个小步，都是我心中最震撼的雷鸣。”
                        </div>
                    </div>

                    {/* Quick Milestones */}
                    <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 shadow-xl border border-white/80">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="material-symbols-outlined text-primary text-3xl">timeline</span>
                            <h2 className="text-2xl font-serif italic text-text-soft">近期里程碑</h2>
                        </div>

                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-nice">
                            {milestones.length > 0 ? (
                                [...milestones].reverse().slice(0, 5).map((m, idx) => (
                                    <div key={m.id || idx} className="flex gap-4 items-start group">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0 z-10 relative">
                                                <span className="material-symbols-outlined text-primary text-lg">verified</span>
                                            </div>
                                            {idx !== 4 && <div className="absolute top-10 left-1/2 w-[1px] h-10 bg-primary/10 -translate-x-1/2"></div>}
                                        </div>
                                        <div className="pt-1">
                                            <div className="text-[10px] font-sans text-primary/60 mb-0.5 uppercase tracking-tighter">{m.date}</div>
                                            <div className="text-base font-serif text-text-soft group-hover:text-primary transition-colors">{m.title}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 opacity-40">
                                    <span className="material-symbols-outlined text-5xl mb-4">history</span>
                                    <div className="text-text-muted font-sans">暂无记录</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <section className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 shadow-xl border border-white/80">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-primary text-3xl">history</span>
                        <h2 className="text-2xl font-serif italic text-text-soft">历史记录</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans">
                            <thead className="text-text-muted text-xs uppercase tracking-widest border-b border-primary/5">
                                <tr>
                                    <th className="pb-4 font-medium pl-4">日期</th>
                                    <th className="pb-4 font-medium">身高</th>
                                    <th className="pb-4 font-medium">体重</th>
                                    <th className="pb-4 font-medium">睡眠</th>
                                    <th className="pb-4 font-medium">乳牙</th>
                                    <th className="pb-4 font-medium">备注</th>
                                    <th className="pb-4 font-medium pr-4 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {records.length > 0 ? (
                                    [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
                                        <tr key={record.id} className="group hover:bg-white/40 transition-colors">
                                            <td className="py-5 pl-4">
                                                <div className="text-text-soft font-medium">{record.date}</div>
                                            </td>
                                            <td className="py-5">
                                                <div className="text-text-soft">{record.height ? `${record.height} cm` : '--'}</div>
                                            </td>
                                            <td className="py-5">
                                                <div className="text-text-soft">{record.weight ? `${record.weight} kg` : '--'}</div>
                                            </td>
                                            <td className="py-5">
                                                <div className="text-text-soft">{record.sleepHours ? `${record.sleepHours} h` : '--'}</div>
                                            </td>
                                            <td className="py-5">
                                                <div className="text-text-soft">{record.toothCount ?? '--'} 颗</div>
                                            </td>
                                            <td className="py-5">
                                                <div className="text-text-muted text-xs max-w-[150px] truncate" title={record.note}>
                                                    {record.note || '--'}
                                                </div>
                                            </td>
                                            <td className="py-5 pr-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => { setEditingRecord(record); setIsEditorOpen(true); }}
                                                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => record.id && handleDelete(record.id)}
                                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-text-muted/60 italic">
                                            还没有任何记录呢，快点击上方按钮记一笔吧。
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => {
                    setEditingRecord(null);
                    setIsEditorOpen(true);
                }}
                className="fixed bottom-8 left-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group md:hidden lg:flex"
                title="记录新成长"
            >
                <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
            </button>

            {/* Editor Modal */}
            <GrowthEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSave={handleSave}
                initialData={editingRecord}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="抹去这段痕迹？"
                message="确定要删除这条成长记录吗？这段成长的轨迹将永远消失在星空中。"
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
};

export default GrowthArchive;
