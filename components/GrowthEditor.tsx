import React, { useState, useEffect } from 'react';
import { GrowthRecord } from '../types';
import CustomDatePicker from './CustomDatePicker';

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
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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
        setAttemptedSubmit(false);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const isHeightValid = height.trim() !== '';
    const isWeightValid = weight.trim() !== '';
    const isFormValid = isHeightValid && isWeightValid;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAttemptedSubmit(true);

        if (!isFormValid) return;

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-text-soft/40 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-lg p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-2xl border border-white/80 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h2 className="font-serif italic text-2xl md:text-3xl text-text-soft flex items-center gap-2 md:gap-3">
                        <span className="material-symbols-outlined text-primary text-xl md:text-2xl">monitoring</span>
                        {initialData ? '修改成长记录' : '记录新的成长'}
                    </h2>
                    <button onClick={onClose} className="text-text-soft hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs md:text-sm font-sans text-text-muted ml-1">记录日期</label>
                        <CustomDatePicker
                            value={date}
                            onChange={setDate}
                            placeholder="记录日期"
                            className="w-full bg-primary/5 border border-primary/10 rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 focus-within:border-primary focus-within:outline-none transition-all text-sm md:text-base text-text-soft"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-1.5 md:space-y-2">
                            <label className="text-xs md:text-sm font-sans text-text-muted ml-1">身高 (cm)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="如: 75"
                                className={`w-full bg-primary/5 border ${attemptedSubmit && !isHeightValid ? 'border-primary/40 scale-[1.01]' : 'border-primary/10'} rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 focus:border-primary focus:outline-none transition-all text-sm md:text-base text-text-soft`}
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                            {attemptedSubmit && !isHeightValid && (
                                <p className="text-[10px] md:text-xs text-primary/60 italic ml-1 animate-in fade-in slide-in-from-top-1">亲爱的，这里也想记录一下呢...</p>
                            )}
                        </div>
                        <div className="space-y-1.5 md:space-y-2">
                            <label className="text-xs md:text-sm font-sans text-text-muted ml-1">体重 (kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="如: 9.5"
                                className={`w-full bg-primary/5 border ${attemptedSubmit && !isWeightValid ? 'border-primary/40 scale-[1.01]' : 'border-primary/10'} rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 focus:border-primary focus:outline-none transition-all text-sm md:text-base text-text-soft`}
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                            {attemptedSubmit && !isWeightValid && (
                                <p className="text-[10px] md:text-xs text-primary/60 italic ml-1 animate-in fade-in slide-in-from-top-1">别忘了填上宝贝的小进步哦</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-1.5 md:space-y-2">
                            <label className="text-xs md:text-sm font-sans text-text-muted ml-1">每日睡眠 (小时)</label>
                            <input
                                type="number"
                                step="0.5"
                                placeholder="如: 12"
                                className="w-full bg-primary/5 border border-primary/10 rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 focus:border-primary focus:outline-none transition-all text-sm md:text-base text-text-soft"
                                value={sleepHours}
                                onChange={(e) => setSleepHours(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5 md:space-y-2">
                            <label className="text-xs md:text-sm font-sans text-text-muted ml-1">乳牙数量</label>
                            <input
                                type="number"
                                placeholder="如: 4"
                                className="w-full bg-primary/5 border border-primary/10 rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 focus:border-primary focus:outline-none transition-all text-sm md:text-base text-text-soft"
                                value={toothCount}
                                onChange={(e) => setToothCount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs md:text-sm font-sans text-text-muted ml-1">备注/小记</label>
                        <textarea
                            placeholder="写下今天的特别之处..."
                            className="w-full bg-primary/5 border border-primary/10 rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 focus:border-primary focus:outline-none transition-all text-sm md:text-base text-text-soft min-h-[80px] md:min-h-[100px] resize-none"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`w-full ${isFormValid ? 'bg-primary' : 'bg-primary/40 cursor-not-allowed'} text-white font-serif italic text-xl py-4 rounded-2xl shadow-lg transition-all transform ${isFormValid ? 'active:scale-[0.98] hover:bg-primary/90' : ''}`}
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
