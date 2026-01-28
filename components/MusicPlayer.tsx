import React, { useState, useEffect, useRef } from 'react';

const PLAYLIST = [
    {
        id: 'lullaby',
        name: '宁静摇篮曲',
        icon: 'bedtime',
        url: '/music/lullaby.mp3'
    },
    {
        id: 'playful',
        name: '欢快午后',
        icon: 'wb_sunny',
        url: '/music/playful.mp3'
    },
    {
        id: 'calm',
        name: '星空的梦',
        icon: 'auto_awesome',
        url: '/music/calm.mp3'
    }
];

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(() => Math.floor(Math.random() * PLAYLIST.length));
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }

        audioRef.current = new Audio(PLAYLIST[currentTrackIndex].url);
        audioRef.current.volume = 0.3;

        // Auto play next random track when current ends
        audioRef.current.onended = () => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * PLAYLIST.length);
            } while (nextIndex === currentTrackIndex && PLAYLIST.length > 1);
            setCurrentTrackIndex(nextIndex);
        };

        if (isPlaying) {
            audioRef.current.play().catch(err => {
                console.warn("Autoplay blocked, waiting for interaction...", err);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [currentTrackIndex]);

    // Handle browser autoplay restrictions by listening for first interaction
    useEffect(() => {
        const handleInteraction = () => {
            if (isPlaying && audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(err => console.warn("Playback failed on interaction:", err));
            }
            // Once we've attempted to play on interaction, we can remove the listeners
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };

        if (isPlaying) {
            window.addEventListener('click', handleInteraction);
            window.addEventListener('touchstart', handleInteraction);
        }

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, [isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((err) => {
                console.warn("Audio play blocked by browser policy:", err);
            });
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[1000] flex flex-col items-end">
            {/* Main Toggle Button */}
            <div className="relative group">
                {/* Tooltip for current track - hidden on mobile */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full border border-white/60 shadow-xl opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                    <span className="text-primary font-serif italic text-sm tracking-widest">
                        正在播放: {PLAYLIST[currentTrackIndex].name}
                    </span>
                </div>

                <button
                    onClick={togglePlay}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-2 ${isPlaying
                        ? 'bg-white border-[#dfc9a6] text-[#c5a059]'
                        : 'bg-white/40 backdrop-blur-md border-white/60 text-[#dfc9a6] hover:bg-white/60'
                        }`}
                    title={isPlaying ? "暂停配乐" : "播放配乐"}
                >
                    <div className={`relative flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                        <span className="material-symbols-outlined text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            music_note
                        </span>
                        {isPlaying && (
                            <div className="absolute -inset-2 opacity-20">
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full animate-ping"></span>
                            </div>
                        )}
                    </div>
                </button>
            </div>

            {/* Visual Feedback: Music Notes */}
            {isPlaying && (
                <div className="absolute bottom-full right-0 mb-4 pointer-events-none -z-10">
                    <div className="flex flex-col gap-4 items-end overflow-hidden h-32 w-12 mr-2">
                        <span className="material-symbols-outlined text-[#dfc9a6]/40 text-xl animate-[float_3s_ease-in-out_infinite]">music_note</span>
                        <span className="material-symbols-outlined text-[#dfc9a6]/20 text-sm animate-[float_4s_ease-in-out_infinite_1s]">music_note</span>
                        <span className="material-symbols-outlined text-[#dfc9a6]/30 text-lg animate-[float_5s_ease-in-out_infinite_0.5s]">music_note</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
