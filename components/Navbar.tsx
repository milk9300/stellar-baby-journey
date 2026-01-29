import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
    title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[100]">
            <div className="relative">
                <button
                    onClick={toggleMenu}
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/80 hover:bg-white backdrop-blur-md transition-all shadow-xl border border-primary/20 text-primary group ring-1 ring-black/5"
                >
                    <span className="material-symbols-outlined text-2xl md:text-3xl transition-transform group-hover:scale-110">
                        {isMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>

                {/* Mobile Overlay */}
                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 mt-4 w-64 md:w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/10 overflow-hidden py-3 transform transition-all duration-200 origin-top-right animate-in fade-in zoom-in-95">
                        <div className="px-5 py-2 mb-1 md:hidden">
                            <h2 className="font-handwritten text-lg text-primary border-b border-primary/10 pb-2">导航菜单</h2>
                        </div>
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition-colors ${location.pathname === '/' ? 'text-primary font-bold bg-primary/5' : 'text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-xl md:text-xl text-primary/70">vertical_split</span>
                            <span className="font-sans text-base">成长轨迹</span>
                        </Link>
                        <Link
                            to="/horizontal"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition-colors ${location.pathname === '/horizontal' ? 'text-primary font-bold bg-primary/5' : 'text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-xl md:text-xl text-primary/70">panorama</span>
                            <span className="font-sans text-base">记忆画卷</span>
                        </Link>
                        <Link
                            to="/book"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition-colors ${location.pathname === '/book' ? 'text-primary font-bold bg-primary/5' : 'text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-xl md:text-xl text-primary/70">auto_stories</span>
                            <span className="font-sans text-base">时光绘本</span>
                        </Link>
                        <Link
                            to="/archive"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition-colors ${location.pathname === '/archive' ? 'text-primary font-bold bg-primary/5' : 'text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-xl md:text-xl text-primary/70">monitoring</span>
                            <span className="font-sans text-base">成长档案</span>
                        </Link>
                        <Link
                            to="/guide"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition-colors ${location.pathname === '/guide' ? 'text-primary font-bold bg-primary/5' : 'text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-xl md:text-xl text-primary/70">help_outline</span>
                            <span className="font-sans text-base">使用指南</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
