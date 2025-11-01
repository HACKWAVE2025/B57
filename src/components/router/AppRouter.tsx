import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../dashboards/Dashboard";
import { FileManager } from "../file/FileManager";
import { TaskManager } from "../tasks/TaskManager";
import { NotesManager } from "../notes/NotesManager";
import { InterviewPrep } from "../InterviewPrep/InterviewPrep";
import { TeamSpace } from "../team/TeamSpace";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/files/*" element={<FileManager />} />
      <Route path="/tasks/*" element={<TaskManager />} />
      <Route path="/notes/*" element={<NotesManager />} />
      <Route path="/interview/*" element={<InterviewPrep />} />
      <Route path="/team/*" element={<TeamSpace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
