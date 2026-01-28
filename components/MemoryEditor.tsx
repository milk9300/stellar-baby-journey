import React, { useState, useEffect } from 'react';
import { Milestone } from '../types';
import { compressImage } from '../utils/storage';

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
    }, [initialData, isOpen]);

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <div className="absolute inset-0 bg-text-soft/60 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-[#fffaf0] w-full max-w-2xl p-8 rounded-[40px] shadow-2xl border-4 border-primary/20 max-h-[90vh] overflow-y-auto">
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-secondary/30 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-serif italic text-4xl text-text-soft flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">edit_note</span>
                            {initialData ? '编辑这段回忆' : '记下新的惊喜'}
                        </h2>
                        <button onClick={onClose} className="text-text-soft hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-handwritten text-2xl text-text-soft ml-2">日期</label>
                                <input
                                    type="date"
                                    className="w-full bg-white border-2 border-primary/10 rounded-2xl px-4 py-3 focus:border-primary/40 focus:outline-none transition-colors text-text-soft font-sans placeholder:text-text-muted"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="font-handwritten text-2xl text-text-soft ml-2">标题</label>
                                <input
                                    type="text"
                                    placeholder="给瞬间起个名"
                                    className="w-full bg-white border-2 border-primary/10 rounded-2xl px-4 py-3 focus:border-primary/40 focus:outline-none transition-colors text-text-soft font-sans placeholder:text-text-muted"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-handwritten text-2xl text-text-soft ml-2">描述</label>
                            <textarea
                                placeholder="那一刻发生了什么有趣的事..."
                                className="w-full bg-white border-2 border-primary/10 rounded-2xl px-4 py-3 focus:border-primary/40 focus:outline-none transition-colors min-h-[120px] resize-none text-text-soft font-sans placeholder:text-text-muted"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="font-handwritten text-2xl text-text-soft ml-2 block">照片 (可多选)</label>

                            {/* Gallery Preview */}
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide min-h-[140px] items-center">
                                {imgs.map((src, idx) => (
                                    <div key={idx} className="relative flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/20 group shadow-md">
                                        <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                ))}
                                <label
                                    htmlFor="photo-upload"
                                    className="flex-shrink-0 w-32 h-32 rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center bg-white/50 hover:bg-white/80 cursor-pointer transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-primary/40 text-3xl">add_a_photo</span>
                                    <span className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">添加更多</span>
                                </label>
                            </div>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="photo-upload"
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isCompressing}
                                className="w-full bg-primary hover:bg-opacity-90 disabled:bg-gray-300 text-white font-serif italic text-2xl py-5 rounded-full shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]"
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
        </div>
    );
};

export default MemoryEditor;
