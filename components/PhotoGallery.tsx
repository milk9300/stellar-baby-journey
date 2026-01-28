import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PhotoGalleryProps {
    images: string[];
    title: string;
    autoPlayInterval?: number;
    isManagementMode?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    allowZoom?: boolean;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
    images,
    title,
    autoPlayInterval = 4000,
    isManagementMode,
    onEdit,
    onDelete,
    allowZoom = true
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (images.length <= 1 || isPaused || zoomedIndex !== null) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [images.length, autoPlayInterval, isPaused, zoomedIndex]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: scrollRef.current.clientWidth * currentIndex,
                behavior: 'smooth'
            });
        }
    }, [currentIndex]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const newIndex = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
            if (newIndex !== currentIndex && !isNaN(newIndex) && newIndex >= 0 && newIndex < images.length) {
                // We keep it simple
            }
        }
    };

    const handleZoomNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (zoomedIndex !== null) {
            setZoomedIndex((zoomedIndex + 1) % images.length);
        }
    };

    const handleZoomPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (zoomedIndex !== null) {
            setZoomedIndex((zoomedIndex - 1 + images.length) % images.length);
        }
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden group/gallery"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            {/* Gallery Container */}
            <div
                ref={scrollRef}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
                onScroll={handleScroll}
            >
                {images.length > 0 ? (
                    images.map((src, i) => (
                        <div key={i} className="w-full h-full flex-shrink-0 snap-center relative overflow-hidden">
                            <img
                                alt={`${title} ${i + 1}`}
                                className={`w-full h-full object-cover transition-all duration-700 hover:scale-105 ${allowZoom && !isManagementMode ? 'cursor-zoom-in' : ''}`}
                                src={src}
                                onClick={(e) => {
                                    if (!isManagementMode && allowZoom) {
                                        e.stopPropagation();
                                        setZoomedIndex(i);
                                    }
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-text-muted">
                        <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                    </div>
                )}
            </div>

            {/* Pagination Dots */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(i);
                            }}
                            className={`w-2 h-2 rounded-full shadow-sm transition-all duration-300 ${i === currentIndex ? 'bg-white scale-125 w-4' : 'bg-white/40'
                                }`}
                        ></button>
                    ))}
                </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 text-white opacity-0 group-hover/gallery:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/40 backdrop-blur-sm"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex((prev) => (prev + 1) % images.length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 text-white opacity-0 group-hover/gallery:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/40 backdrop-blur-sm"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </>
            )}

            {/* Edit Actions Overlay */}
            {isManagementMode && onEdit && onDelete && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-4 opacity-0 group-hover/gallery:opacity-100 transition-opacity z-40">
                    <button
                        onClick={onEdit}
                        className="w-12 h-12 bg-white rounded-full text-primary hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
                    >
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                        onClick={onDelete}
                        className="w-12 h-12 bg-white rounded-full text-red-400 hover:scale-110 transition-transform flex items-center justify-center shadow-lg"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            )}

            {/* Lightbox / Zoom Overlay (Portalled to Body) */}
            {zoomedIndex !== null && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in duration-300 cursor-zoom-out"
                    onClick={() => setZoomedIndex(null)}
                >
                    <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white/40 hover:text-white transition-all hover:rotate-90 z-[10001]">
                        <span className="material-symbols-outlined text-3xl md:text-5xl">close</span>
                    </button>

                    {/* Lightbox Navigation - hidden or smaller on mobile */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handleZoomPrev}
                                className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center group/btn z-[10001]"
                            >
                                <span className="material-symbols-outlined text-3xl md:text-5xl group-hover/btn:-translate-x-1 transition-transform">chevron_left</span>
                            </button>
                            <button
                                onClick={handleZoomNext}
                                className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center group/btn z-[10001]"
                            >
                                <span className="material-symbols-outlined text-3xl md:text-5xl group-hover/btn:translate-x-1 transition-transform">chevron_right</span>
                            </button>
                        </>
                    )}
                    <div className="relative max-w-full max-h-full flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
                        <div className="relative animate-in slide-in-from-bottom-4 duration-500">
                            <img
                                src={images[zoomedIndex]}
                                className="max-w-full max-h-[80vh] object-contain shadow-[0_0_80px_rgba(255,255,255,0.1)] rounded-sm p-1 bg-white/5"
                                alt="Full View"
                            />
                            {/* Counter */}
                            <div className="absolute -top-12 left-0 text-white/20 font-serif italic text-lg tracking-widest">
                                {zoomedIndex + 1} / {images.length}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-60 px-4 text-center">
                            <div className="font-serif italic text-white text-xl md:text-3xl tracking-wide">{title}</div>
                            <div className="font-handwritten text-white/50 text-base md:text-xl text-center">时光流转，美好永驻</div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style>
                {`
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

export default PhotoGallery;
