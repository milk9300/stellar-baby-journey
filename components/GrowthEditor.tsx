import React, { useState, useEffect } from 'react';
import { GrowthRecord } from '../types';

interface GrowthEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (record: Partial<GrowthRecord>) => void;
    initialData?: GrowthRecord | null;
}

const GrowthEditor: React.FC<GrowthEditorProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [sleepHours, setSleepHours] = useState<string>('');
    const [toothCount, setToothCount] = useState<string>('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (initialData) {
            setDate(initialData.date);
            setHeight(initialData.height?.toString() || '');
            setWeight(initialData.weight?.toString() || '');
            setSleepHours(initialData.sleepHours?.toString() || '');
            setToothCount(initialData.toothCount?.toString() || '');
            setNote(initialData.note || '');
        } else {
            setDate(new Date().toISOString().split('T')[0]);
            setHeight('');
            setWeight('');
            setSleepHours('');
            setToothCount('');
            setNote('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...initialData,
            date,
            height: height ? parseFloat(height) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
            toothCount: toothCount ? parseInt(toothCount) : undefined,
            note
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-text-soft/40 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-lg p-8 rounded-[40px] shadow-2xl border border-white/80 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-serif italic text-3xl text-text-soft flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">monitoring</span>
                        {initialData ? '修改成长记录' : '记录新的成长'}
                    </h2>
                    <button onClick={onClose} className="text-text-soft hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-sans text-text-muted ml-1">记录日期</label>
                        <input
                            type="date"
                            className="w-full bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-text-soft"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-sans text-text-muted ml-1">身高 (cm)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="如: 75"
                                className="w-full bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-text-soft"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-sans text-text-muted ml-1">体重 (kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="如: 9.5"
                                className="w-full bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-text-soft"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-sans text-text-muted ml-1">每日睡眠 (小时)</label>
                            <input
                                type="number"
                                step="0.5"
                                placeholder="如: 12"
                                className="w-full bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-text-soft"
                                value={sleepHours}
                                onChange={(e) => setSleepHours(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-sans text-text-muted ml-1">乳牙数量</label>
                            <input
                                type="number"
                                placeholder="如: 4"
                                className="w-full bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-text-soft"
                                value={toothCount}
                                onChange={(e) => setToothCount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-sans text-text-muted ml-1">备注/小记</label>
                        <textarea
                            placeholder="写下今天的特别之处..."
                            className="w-full bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3 focus:border-primary focus:outline-none transition-all text-text-soft min-h-[100px] resize-none"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-serif italic text-xl py-4 rounded-2xl shadow-lg transition-all transform active:scale-[0.98]"
                        >
                            保存这一份记录
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GrowthEditor;
