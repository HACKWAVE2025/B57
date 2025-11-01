import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<div>Dashboard</div>} />
      <Route path="/tasks" element={<div>Tasks</div>} />
      <Route path="/notes" element={<div>Notes</div>} />
      <Route path="/chat" element={<div>AI Chat</div>} />
      <Route path="/interview" element={<div>Interview Prep</div>} />
      <Route path="/team" element={<div>Team</div>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
