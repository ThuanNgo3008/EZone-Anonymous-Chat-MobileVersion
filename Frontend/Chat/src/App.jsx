import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import AnonymousChatRoom from './components/AnonymousChatRoom.jsx';
import WaitingScreen from './components/WaitingScreen.jsx';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Toaster position="top-center" richColors />
            <Routes>
                <Route path="/waiting" element={<WaitingScreen />} />
                <Route path="/" element={<AnonymousChatRoom />} />
            </Routes>
        </Router>
    );
}

export default App;