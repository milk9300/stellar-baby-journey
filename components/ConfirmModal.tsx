import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = '确定',
    cancelText = '取消',
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] md:rounded-[40px] shadow-2xl border border-white/80 p-6 md:p-10 max-w-sm w-full text-center animate-in zoom-in slide-in-from-bottom-8 duration-500 relative">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl md:text-4xl">auto_awesome</span>
                </div>

                <h3 className="font-serif italic text-2xl md:text-3xl text-text-soft mb-3 md:mb-4">{title}</h3>
                <p className="font-sans text-text-muted text-base md:text-lg mb-6 md:mb-10 leading-relaxed">
                    {message}
                </p>

                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-white/40 hover:bg-white/60 text-text-muted py-3 md:py-4 rounded-full font-handwritten text-xl md:text-2xl transition-all active:scale-95"
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-primary hover:bg-opacity-90 text-white py-3 md:py-4 rounded-full font-handwritten text-xl md:text-2xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        {cancelText}
                    </button>
                </div>
                {/* Decorative stars */}
                <div className="absolute top-8 left-8 text-primary/20">
                    <span className="material-symbols-outlined text-sm">sparkles</span>
                </div>
                <div className="absolute bottom-8 right-8 text-primary/20">
                    <span className="material-symbols-outlined text-sm">sparkles</span>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
