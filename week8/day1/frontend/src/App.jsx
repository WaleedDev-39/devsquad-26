import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ResumeEditor from './pages/ResumeEditor';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:id?" element={<ResumeEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
