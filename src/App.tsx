import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';

function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Super Study App</h1>
      <p className="text-gray-600 dark:text-gray-400">Your AI-powered productivity platform</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<div className="p-8"><h1 className="text-2xl font-bold">Tasks</h1></div>} />
            <Route path="/notes" element={<div className="p-8"><h1 className="text-2xl font-bold">Notes</h1></div>} />
            <Route path="/chat" element={<div className="p-8"><h1 className="text-2xl font-bold">AI Chat</h1></div>} />
            <Route path="/interview" element={<div className="p-8"><h1 className="text-2xl font-bold">Interview Prep</h1></div>} />
            <Route path="/team" element={<div className="p-8"><h1 className="text-2xl font-bold">Team</h1></div>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
