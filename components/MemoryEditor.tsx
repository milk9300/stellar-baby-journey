import React, { useState, useEffect } from 'react';
import { Milestone } from '../types';
import { compressImage } from '../utils/storage';
import CustomDatePicker from './CustomDatePicker';

interface MemoryEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (m: Partial<Milestone>) => void;
    initialData?: Milestone | null;
}

const MemoryEditor: React.FC<MemoryEditorProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [imgs, setImgs] = useState<string[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDate(initialData.date || '');
            setDescription(initialData.description);
            setImgs(initialData.imgs || []);
        } else {
            setTitle('');
            setDate('');
            setDescription('');
            setImgs([]);
        }
        setAttemptedSubmit(false);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const isDateValid = date.trim() !== '';
    const isTitleValid = title.trim() !== '';
    const isDescriptionValid = description.trim() !== '';
    const isImgsValid = imgs.length > 0;
    const isFormValid = isDateValid && isTitleValid && isDescriptionValid && isImgsValid;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];
        if (files.length > 0) {
            setIsCompressing(true);
            try {
                const results = await Promise.all(
                    files.map(file => compressImage(file))
                );
                setImgs(prev => [...prev, ...results]);
            } finally {
                setIsCompressing(false);
            }
        }
    };

    const removeImage = (index: number) => {
        setImgs(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAttemptedSubmit(true);

        if (!isFormValid) return;

        onSave({
            ...initialData,
            title,
            date,
            description,
            imgs,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 md:p-12">
            <div className="absolute inset-0 bg-text-soft/60 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-[#fffaf0] w-full max-w-2xl p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-2xl border-4 border-primary/20 max-h-[90vh] overflow-y-auto">
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-secondary/30 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <h2 className="font-serif italic text-2xl md:text-4xl text-text-soft flex items-center gap-2 md:gap-3">
                            <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">edit_note</span>
                            {initialData ? '编辑这段回忆' : '记下新的惊喜'}
                        </h2>
                        <button onClick={onClose} className="text-text-soft hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="font-handwritten text-xl md:text-2xl text-text-soft ml-2">日期</label>
                                <CustomDatePicker
                                    value={date}
                                    onChange={setDate}
                                    placeholder="哪一天发生的惊喜呢？"
                                    className={`w-full bg-white border-2 ${attemptedSubmit && !isDateValid ? 'border-primary/40 scale-[1.01]' : 'border-primary/10'} rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 focus-within:border-primary/40 focus-within:outline-none transition-all text-text-soft font-sans placeholder:text-text-muted text-sm md:text-base`}
                                />
                                {attemptedSubmit && !isDateValid && (
                                    <p className="text-[10px] md:text-xs text-primary/60 italic ml-2 animate-in fade-in slide-in-from-top-1">哪一天发生的惊喜呢？</p>
                                )}
                            </div>
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="font-handwritten text-xl md:text-2xl text-text-soft ml-2">标题</label>
                                <input
                                    type="text"
                                    placeholder="给瞬间起个名"
                                    className={`w-full bg-white border-2 ${attemptedSubmit && !isTitleValid ? 'border-primary/40 scale-[1.01]' : 'border-primary/10'} rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 focus:border-primary/40 focus:outline-none transition-all text-text-soft font-sans placeholder:text-text-muted text-sm md:text-base`}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                {attemptedSubmit && !isTitleValid && (
                                    <p className="text-[10px] md:text-xs text-primary/60 italic ml-2 animate-in fade-in slide-in-from-top-1">起个好听的名字吧...</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5 md:space-y-2">
                            <label className="font-handwritten text-xl md:text-2xl text-text-soft ml-2">描述</label>
                            <textarea
                                placeholder="那一刻发生了什么有趣的事..."
                                className={`w-full bg-white border-2 ${attemptedSubmit && !isDescriptionValid ? 'border-primary/40 scale-[1.01]' : 'border-primary/10'} rounded-xl md:rounded-2xl px-4 py-2.5 md:py-3 focus:border-primary/40 focus:outline-none transition-all min-h-[100px] md:min-h-[120px] resize-none text-text-soft font-sans placeholder:text-text-muted text-sm md:text-base`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {attemptedSubmit && !isDescriptionValid && (
                                <p className="text-[10px] md:text-xs text-primary/60 italic ml-2 animate-in fade-in slide-in-from-top-1">这一刻一定有很多想说的话...</p>
                            )}
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <label className="font-handwritten text-xl md:text-2xl text-text-soft ml-2 block">照片 (可多选)</label>

                            {/* Gallery Preview */}
                            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide min-h-[110px] md:min-h-[140px] items-center">
                                {imgs.map((src, idx) => (
                                    <div key={idx} className="relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border-2 border-primary/20 group shadow-md">
                                        <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center opacity-70 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-[10px] md:text-sm">close</span>
                                        </button>
                                    </div>
                                ))}
                                <label
                                    htmlFor="photo-upload"
                                    className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl border-2 border-dashed ${attemptedSubmit && !isImgsValid ? 'border-primary/40 bg-primary/5 scale-[1.05]' : 'border-primary/20 bg-white/50'} flex flex-col items-center justify-center hover:bg-white/80 cursor-pointer transition-all shadow-sm`}
                                >
                                    <span className={`material-symbols-outlined ${attemptedSubmit && !isImgsValid ? 'text-primary/60 animate-bounce' : 'text-primary/40'} text-2xl md:text-3xl`}>add_a_photo</span>
                                    <span className="text-[9px] md:text-[10px] text-text-muted mt-1 uppercase tracking-wider">添加更多</span>
                                </label>
                            </div>
                            {attemptedSubmit && !isImgsValid && (
                                <p className="text-[10px] md:text-xs text-primary/60 italic ml-2 animate-in fade-in slide-in-from-top-1">别忘了放上当天的照片哦</p>
                            )}

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="photo-upload"
                            />
                        </div>

                        <div className="pt-4 md:pt-6">
                            <button
                                type="submit"
                                disabled={isCompressing}
                                className={`w-full ${isFormValid ? 'bg-primary' : 'bg-primary/40 cursor-not-allowed'} text-white font-serif italic text-xl md:text-2xl py-4 md:py-5 rounded-full shadow-lg transition-all transform ${isFormValid ? 'hover:scale-[1.01] active:scale-[0.99] hover:bg-opacity-90' : ''}`}
                            >
                                {isCompressing ? '处理中...' : (initialData ? '保存修改' : '存入绘本')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style>
                {`
                    @keyframes float-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    .animate-float-slow {
                        animation: float-slow 4s ease-in-out infinite;
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}
            </style>
        </div >
    );
};

export default MemoryEditor;
