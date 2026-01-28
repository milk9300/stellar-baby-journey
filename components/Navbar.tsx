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
        <div className="fixed top-8 right-8 z-50">
            <div className="relative">
                <button
                    onClick={toggleMenu}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-white/80 hover:bg-white backdrop-blur-md transition-all shadow-xl border border-primary/20 text-primary group"
                >
                    <span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110">
                        {isMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/10 overflow-hidden py-2 transform transition-all duration-200 origin-top-right">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition-colors ${location.pathname === '/' ? 'text-primary font-bold' : 'text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-xl">vertical_split</span>
                            <span className="font-sans text-lg">成长轨迹</span>
                        </Link>
                        <Link
                            to="/horizontal"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition-colors ${location.pathname === '/horizontal' ? 'text-primary font-bold' : 'text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-xl">panorama</span>
                            <span className="font-sans text-lg">记忆画卷</span>
                        </Link>
                        <Link
                            to="/book"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition-colors ${location.pathname === '/book' ? 'text-primary font-bold' : 'text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-xl">auto_stories</span>
                            <span className="font-sans text-lg">时光绘本</span>
                        </Link>
                        <Link
                            to="/archive"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition-colors ${location.pathname === '/archive' ? 'text-primary font-bold' : 'text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-xl">monitoring</span>
                            <span className="font-sans text-lg">成长档案</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
