import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import VerticalTimeline from './components/VerticalTimeline';
import HorizontalTimeline from './components/HorizontalTimeline';
import HeartMode from './components/HeartMode';
import GrowthArchive from './components/GrowthArchive';
import MemoryBook from './components/MemoryBook';
import MusicPlayer from './components/MusicPlayer';
import MemoryDetail from './components/MemoryDetail';

const App: React.FC = () => {
    return (
        <HashRouter>
            <HeartMode />
            <MusicPlayer />
            <Routes>
                <Route path="/" element={<VerticalTimeline />} />
                <Route path="/horizontal" element={<HorizontalTimeline />} />
                <Route path="/archive" element={<GrowthArchive />} />
                <Route path="/book" element={<MemoryBook />} />
                <Route path="/memory/:id" element={<MemoryDetail />} />
            </Routes>
        </HashRouter>
    );
};

export default App;
