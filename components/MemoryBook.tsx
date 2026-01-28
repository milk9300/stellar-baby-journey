import React, { useState, useEffect } from 'react';
import { Milestone } from '../types';
import { getAllMilestones } from '../utils/storage';
import Navbar from './Navbar';
import PhotoGallery from './PhotoGallery';

const MemoryBook: React.FC = () => {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Min swipe distance in pixels
    const minSwipeDistance = 50;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientY);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isUpSwipe = distance > minSwipeDistance;
        const isDownSwipe = distance < -minSwipeDistance;

        if (isUpSwipe) {
            handleNext();
        } else if (isDownSwipe) {
            handlePrev();
        }
    };

    useEffect(() => {
        const load = async () => {
            const data = await getAllMilestones();
            const sortedData = data.sort((a, b) => {
                const dateA = a.date ? new Date(a.date.replace(/年|月|日/g, '-').replace(/-$/, '')).getTime() : 0;
                const dateB = b.date ? new Date(b.date.replace(/年|月|日/g, '-').replace(/-$/, '')).getTime() : 0;
                return dateA - dateB;
            });
            setMilestones(sortedData);
        };
        load();
    }, []);

    const contentSheetsCount = Math.ceil(milestones.length / 2);
    // Add one dedicated sheet for the final message
    const totalSheets = contentSheetsCount + 1;
    const maxPageIndex = totalSheets;

    const handleNext = () => {
        if (pageIndex < maxPageIndex) setPageIndex(p => p + 1);
    };

    const handlePrev = () => {
        if (pageIndex > 0) setPageIndex(p => p - 1);
    };

    return (
        <div
            className="min-h-screen bg-[#fffaf0] text-stone-800 font-sans overflow-hidden relative selection:bg-orange-100 touch-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Soft Linen Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `url('https://www.transparenttextures.com/patterns/linen.png')`,
                    backgroundSize: '200px'
                }}></div>

            {/* Ambient Window Glow & Watercolor Effects */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_10%,rgba(244,162,158,0.15)_0%,transparent_50%)]"></div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_90%_90%,rgba(186,255,201,0.15)_0%,transparent_50%)]"></div>
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,transparent_40%,transparent_60%,rgba(0,0,0,0.02)_100%)]"></div>

            {/* Scattered Decorations (Themed for Light Mode) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Soft Blurred Photos */}
                <div className="absolute -top-10 -left-10 w-48 h-64 md:w-64 md:h-80 bg-white/40 backdrop-blur-md shadow-lg border border-white/80 p-4 rotate-[-15deg] opacity-60">
                    <div className="w-full h-4/5 bg-primary/5"></div>
                </div>
                <div className="absolute bottom-20 -right-20 w-56 h-72 md:w-72 md:h-96 bg-white/40 backdrop-blur-md shadow-lg border border-white/80 p-4 rotate-[20deg] opacity-50">
                    <div className="w-full h-4/5 bg-secondary/10"></div>
                </div>
                {/* Floating Elements */}
                <span className="material-symbols-outlined absolute top-1/4 right-1/4 text-primary/10 text-6xl md:text-8xl blur-[1px] rotate-12">toys</span>
                <span className="material-symbols-outlined absolute bottom-1/4 left-1/4 text-secondary/20 text-7xl md:text-9xl blur-[1px] -rotate-12">auto_awesome</span>
                <span className="material-symbols-outlined absolute top-10 right-1/3 text-accent/20 text-4xl md:text-6xl blur-[2px]">child_friendly</span>
            </div>

            {/* Ambient Light Particles (Hidden on mobile for performance) */}
            <div className="absolute inset-0 pointer-events-none hidden md:block">
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse-warm"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] animate-pulse-warm delay-1000"></div>
            </div>

            <Navbar title="时光盒" />

            {/* Sidebar TOC - Hidden on Mobile */}
            <div className="fixed left-8 top-32 bottom-32 w-64 z-50 flex flex-col pointer-events-none group/sidebar-container hidden xl:flex">
                <div className="bg-white/40 backdrop-blur-xl border border-white/80 shadow-2xl rounded-2xl p-6 flex flex-col h-full pointer-events-auto transition-all duration-500 hover:bg-white/60 overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#dfc9a6]/30">
                        <span className="material-symbols-outlined text-[#c5a059]">auto_stories</span>
                        <h2 className="font-serif text-xl tracking-widest text-[#8b5e3c]">时光索引</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-4">
                        <button
                            onClick={() => setPageIndex(0)}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3
                                      ${pageIndex === 0 ? 'bg-[#dfc9a6]/20 text-[#8b5e3c] border border-[#dfc9a6]/50 shadow-inner' : 'hover:bg-white/40 text-stone-400 opacity-60'}`}
                        >
                            <span className="material-symbols-outlined text-sm">menu_book</span>
                            <span className="font-serif text-sm tracking-widest uppercase text-xs">封面专页</span>
                        </button>

                        <div className="h-[1px] bg-[#dfc9a6]/20 mx-2"></div>

                        {milestones.map((m, idx) => {
                            const targetPage = idx === 0 ? 1 : Math.floor((idx - 1) / 2) + 2;
                            const isActive = pageIndex === targetPage;

                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setPageIndex(targetPage)}
                                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex flex-col gap-1 group/item
                                              ${isActive ? 'bg-[#dfc9a6]/20 text-[#8b5e3c] border border-[#dfc9a6]/50 shadow-inner translate-x-1' : 'hover:bg-white/40 text-stone-400'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[9px] tracking-[0.2em] font-bold uppercase ${isActive ? 'text-[#c5a059]' : 'text-stone-300'}`}>
                                            Stage {idx + 1}
                                        </span>
                                        <span className="text-[9px] opacity-40 font-sans tracking-wider">{m.date.replace(/-/g, '.')}</span>
                                    </div>
                                    <span className={`font-serif text-sm truncate ${isActive ? 'opacity-100 font-bold' : 'opacity-60 group-hover/item:opacity-100'}`}>
                                        {m.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 3D Scene Container */}
            <div className="xl:ml-72 flex items-center justify-center min-h-screen perspective-container pt-12 md:pt-20 pb-24 md:pb-20 relative z-10 transition-all duration-1000 overflow-x-hidden md:overflow-x-visible">
                {/* Book Shadow */}
                <div
                    className="absolute bottom-[22%] w-[300px] md:w-[500px] h-10 md:h-16 bg-black/5 blur-[30px] md:blur-[40px] rounded-full scale-y-50 transition-all duration-1000 hidden md:block"
                    style={{ transform: pageIndex > 0 ? 'translateX(50%) scaleX(1.1)' : 'translateX(0) scaleX(1)' }}
                ></div>

                {/* Book Body */}
                <div
                    className="relative w-[300px] sm:w-[340px] md:w-[450px] aspect-[1/1.4] transition-all duration-1000 ease-in-out"
                    style={{
                        transformOrigin: 'center center',
                        transform: isMobile
                            ? `rotate(90deg) scale(0.85) ${pageIndex > 0 ? 'translateX(50%)' : 'translateX(0)'}`
                            : `${pageIndex > 0 ? 'translateX(50%)' : 'translateX(0)'} rotate(0deg)`
                    }}
                >
                    {/* Sheet 0: Cover */}
                    <BookSheet
                        index={0}
                        activePageIndex={pageIndex}
                        totalSheets={maxPageIndex}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        zIndex={maxPageIndex}
                    >
                        <FrontFace isCover>
                            <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 border-4 border-transparent rounded-r-md">
                                <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
                                    <div className="mb-8 relative">
                                        <span className="material-symbols-outlined text-7xl text-[#c5a059] animate-pulse-warm">auto_awesome</span>
                                        <div className="absolute inset-0 blur-lg bg-[#c5a059]/20 animate-pulse"></div>
                                    </div>
                                    <h1 className="font-serif text-3xl md:text-5xl text-[#8b5e3c] mb-6 tracking-[0.2em] leading-tight">成长<br />时光</h1>
                                    <div className="w-16 h-[1px] bg-[#c5a059] mb-6 shadow-[0_0_5px_#c5a059]"></div>
                                    <p className="font-display text-[#8b5e3c]/60 text-xs md:text-sm uppercase tracking-[0.4em]">Stellar Journey</p>
                                    <p className="absolute bottom-10 text-[10px] md:text-xs tracking-[0.5em] text-[#c5a059] uppercase font-bold">Volume I</p>
                                </div>
                            </div>
                        </FrontFace>
                        <BackFace>
                            <div className="h-full w-full flex flex-col items-center justify-center bg-[#fdfaf5] p-10 text-center">
                                <h2 className="font-handwritten text-2xl md:text-4xl text-[#5d4037] mb-6 rotate-[-5deg]">致宝贝：</h2>
                                <p className="font-serif text-stone-600 leading-loose text-sm md:text-lg">
                                    每一张照片都是时间的切片。<br />
                                    轻轻翻开，<br />
                                    重温那些温暖的瞬间。
                                </p>
                            </div>
                        </BackFace>
                    </BookSheet>

                    {/* Content Sheets (1 ~ N) */}
                    {Array.from({ length: contentSheetsCount }).map((_, i) => {
                        const milestoneFront = milestones[i * 2];
                        const milestoneBack = milestones[i * 2 + 1];
                        const sheetRealIndex = i + 1;

                        return (
                            <BookSheet
                                key={i}
                                index={sheetRealIndex}
                                activePageIndex={pageIndex}
                                totalSheets={maxPageIndex}
                                onNext={handleNext}
                                onPrev={handlePrev}
                                zIndex={maxPageIndex - sheetRealIndex}
                            >
                                <FrontFace>
                                    {milestoneFront ? <MemoryContent milestone={milestoneFront} /> : <EmptyPage />}
                                </FrontFace>
                                <BackFace>
                                    {milestoneBack ? <MemoryContent milestone={milestoneBack} /> : <EmptyPage />}
                                </BackFace>
                            </BookSheet>
                        );
                    })}

                    {/* Final Sheet: Poetic Message in a Frame */}
                    <BookSheet
                        index={totalSheets}
                        activePageIndex={pageIndex}
                        totalSheets={maxPageIndex}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        zIndex={0}
                    >
                        <FrontFace>
                            <EmptyPage message="我们的故事还在继续..." />
                        </FrontFace>
                        <BackFace isCover>
                            <div className="h-full w-full border-4 border-transparent rounded-l-md opacity-10">
                                {/* Plain blank back cover */}
                            </div>
                        </BackFace>
                    </BookSheet>

                    {/* Book Thickness Simulation */}
                    <div className="absolute top-1 right-0 w-[98%] h-[98%] bg-white rounded-r-md shadow-2xl -z-10 transform translate-x-1 translate-y-1 border border-stone-200"></div>
                    <div className="absolute top-2 right-0 w-[98%] h-[98%] bg-white rounded-r-md shadow-xl -z-20 transform translate-x-2 translate-y-2 border border-stone-200"></div>
                </div>

                {/* Controls & Scrubber */}
                <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-6 z-[100] px-6">
                    {/* Scrub bar - Small screens adjustment */}
                    <div className="w-full max-w-sm md:max-w-xl group/scrub flex items-center gap-2 md:gap-4 px-2 md:px-8">
                        <span className="text-[9px] md:text-[10px] font-bold text-stone-300 tracking-[0.2em]">0</span>
                        <input
                            type="range"
                            min="0"
                            max={maxPageIndex}
                            value={pageIndex}
                            onChange={(e) => setPageIndex(parseInt(e.target.value))}
                            className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#c5a059] hover:h-2 transition-all duration-300"
                        />
                        <span className="text-[9px] md:text-[10px] font-bold text-stone-300 tracking-[0.2em]">{maxPageIndex}</span>
                    </div>

                    <div className="flex justify-center gap-4 md:gap-8 scale-90 md:scale-100">
                        <button
                            onClick={handlePrev}
                            disabled={pageIndex === 0}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur shadow-lg border border-stone-100 text-stone-600 flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                        >
                            <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_left</span>
                        </button>
                        <div className="bg-white/80 backdrop-blur px-6 md:px-8 h-12 md:h-14 rounded-full shadow-lg border border-stone-100 flex items-center justify-center font-serif text-stone-500 text-base md:text-lg min-w-[100px] md:min-w-[120px]">
                            {pageIndex} / {maxPageIndex}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={pageIndex === maxPageIndex}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/80 backdrop-blur shadow-lg text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:bg-stone-300 disabled:hover:scale-100"
                        >
                            <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .perspective-container {
                    perspective: 2500px;
                }
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap');
                .font-handwritten { font-family: 'Caveat', cursive; }
                .font-serif { font-family: 'Noto Serif SC', serif; }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
            `}</style>
        </div >
    );
};

// --- Sheet Component ---
interface BookSheetProps {
    index: number;
    activePageIndex: number;
    children: React.ReactNode;
    onNext: () => void;
    onPrev: () => void;
    zIndex: number;
    totalSheets: number;
}

const BookSheet: React.FC<BookSheetProps> = ({ index, activePageIndex, children, onNext, onPrev, zIndex, totalSheets }) => {
    const isFlipped = index < activePageIndex;
    const rotateAngle = isFlipped ? -180 : 0;
    const dynamicZIndex = isFlipped ? index : (totalSheets - index);

    return (
        <div
            className="absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out cursor-pointer group"
            style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                transform: `rotateY(${rotateAngle}deg)`,
                zIndex: dynamicZIndex,
            }}
            onClick={() => {
                if (isFlipped) onPrev();
                else onNext();
            }}
        >
            {children}
        </div>
    );
};

// --- FrontFace Component ---
const FrontFace: React.FC<{ children: React.ReactNode; isCover?: boolean }> = ({ children, isCover }) => (
    <div
        className={`absolute inset-0 backface-hidden w-full h-full shadow-sm overflow-hidden 
                   ${isCover ? 'bg-[#fcf8f0] text-[#8b5e3c] rounded-r-md' : 'bg-[#fdfaf5] rounded-r-sm'}`}
        style={{
            background: isCover
                ? 'linear-gradient(135deg, #fcf8f0 0%, #f4eee0 100%)'
                : 'linear-gradient(to right, #e8e0cf 0%, #fdfaf5 5%, #fdfaf5 95%, #e8e0cf 100%)',
            boxShadow: isCover ? 'inset 3px 0 10px rgba(0,0,0,0.05), 5px 0 15px rgba(0,0,0,0.1)' : 'inset 3px 0 10px rgba(0,0,0,0.05)'
        }}
    >
        {isCover && (
            <div className="absolute inset-0 border-[12px] border-[#dfc9a6] m-4 pointer-events-none">
                <div className="absolute inset-0 border-[2px] border-[#dfc9a6] m-2"></div>
            </div>
        )}
        {!isCover && <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none mix-blend-multiply"></div>}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-tl-full"></div>
        {children}
    </div>
);

// --- BackFace Component ---
const BackFace: React.FC<{ children: React.ReactNode; isCover?: boolean }> = ({ children, isCover }) => (
    <div
        className={`absolute inset-0 backface-hidden w-full h-full shadow-sm overflow-hidden 
                   ${isCover ? 'bg-[#fcf8f0] text-[#8b5e3c] rounded-l-md' : 'bg-[#fdfaf5] rounded-l-sm'}`}
        style={{
            transform: 'rotateY(180deg)',
            background: isCover
                ? 'linear-gradient(225deg, #fcf8f0 0%, #f4eee0 100%)'
                : 'linear-gradient(to left, #e8e0cf 0%, #fdfaf5 5%, #fdfaf5 95%, #e8e0cf 100%)',
            boxShadow: isCover ? 'inset -3px 0 10px rgba(0,0,0,0.05)' : 'inset -3px 0 10px rgba(0,0,0,0.05)'
        }}
    >
        {isCover && (
            <div className="absolute inset-0 border-[12px] border-[#dfc9a6] m-4 pointer-events-none">
                <div className="absolute inset-0 border-[2px] border-[#dfc9a6] m-2"></div>
            </div>
        )}
        {!isCover && <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none mix-blend-multiply"></div>}
        {children}
    </div>
);

// --- Content Rendering ---
const MemoryContent: React.FC<{ milestone: Milestone }> = ({ milestone }) => {
    return (
        <div className="h-full w-full p-6 md:p-10 flex flex-col relative group/content">
            <div className="relative transform transition-transform duration-500 group-hover/content:rotate-1 bg-white p-4 shadow-xl pb-12 mb-8 border border-stone-100 ring-1 ring-black/5">
                <div className="aspect-[4/3] bg-stone-50 overflow-hidden relative">
                    {milestone.imgs && milestone.imgs.length > 0 ? (
                        <div className="w-full h-full sepia-[.1]">
                            <PhotoGallery
                                images={milestone.imgs}
                                title={milestone.title}
                                autoPlayInterval={5000}
                                allowZoom={false}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-200">
                            <span className="material-symbols-outlined text-6xl">image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover/content:opacity-100 transition-opacity duration-1000 pointer-events-none z-10"></div>
                </div>
                <div className="absolute bottom-3 right-5 font-handwritten text-stone-400 text-sm md:text-xl rotate-[-2deg]">
                    {milestone.date}
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <h3 className="font-serif text-lg md:text-3xl text-[#5d4037] mb-2 md:mb-4 border-b border-[#e0d5c1] pb-2 md:pb-3 inline-block leading-tight">
                    {milestone.title}
                </h3>
                <p className="font-serif text-stone-600 text-xs md:text-lg leading-relaxed opacity-90 first-letter:text-xl md:first-letter:text-3xl first-letter:font-bold first-letter:mr-1">
                    {milestone.description}
                </p>
            </div>

            <div className="absolute bottom-6 left-0 w-full text-center">
                <span className="text-xs tracking-[0.4em] text-stone-300 uppercase font-display">Moment of Love</span>
            </div>
        </div>
    );
};

const EmptyPage = ({ message }: { message?: string }) => (
    <div className="h-full w-full p-6 md:p-10 flex items-center justify-center">
        <div className="w-full h-full border-2 border-dashed border-[#dfc9a6]/30 rounded-2xl flex flex-col items-center justify-center bg-white/30 backdrop-blur-[2px] shadow-inner relative overflow-hidden group/empty">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(223,201,166,0.05),transparent)] pointer-events-none"></div>

            <span className="material-symbols-outlined text-6xl text-[#dfc9a6] opacity-20 mb-6 group-hover/empty:scale-110 transition-transform duration-700">
                {message ? 'auto_stories' : 'edit_note'}
            </span>

            {message ? (
                <div className="text-center px-8 relative">
                    <div className="w-8 h-[1px] bg-[#dfc9a6] mx-auto mb-6 opacity-30"></div>
                    <p className="font-serif text-lg md:text-2xl text-[#8b5e3c]/60 tracking-[0.3em] leading-relaxed italic animate-pulse-warm">
                        {message}
                    </p>
                    <div className="w-8 h-[1px] bg-[#dfc9a6] mx-auto mt-6 opacity-30"></div>
                    <span className="material-symbols-outlined mt-8 text-[#dfc9a6] opacity-20 text-2xl md:text-3xl">favorite</span>
                </div>
            ) : (
                <span className="font-serif text-base md:text-xl italic text-stone-300 tracking-widest">期待更多回忆...</span>
            )}
        </div>
    </div>
);

export default MemoryBook;
