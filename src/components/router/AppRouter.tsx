import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../dashboards/Dashboard";
import { FileManager } from "../file/FileManager";
import { TaskManager } from "../tasks/TaskManager";
import { NotesManager } from "../notes/NotesManager";
import { Calendar } from "../calendar/Calendar";
import { JournalManager } from "../journal/JournalManager";
import { EnhancedAIChat } from "../ai/EnhancedAIChat";
import { StudyTools } from "../StudyTools";
import { FlashCards } from "../FlashCards";
import { Community } from "../Community";
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
      <Route path="/calendar/*" element={<Calendar />} />
      <Route path="/journal/*" element={<JournalManager />} />
      <Route path="/chat/*" element={<EnhancedAIChat />} />
      <Route path="/tools/*" element={<StudyTools />} />
      <Route path="/flashcards/*" element={<FlashCards />} />
      <Route path="/community/*" element={<Community />} />
      <Route path="/interview/*" element={<InterviewPrep />} />
      <Route path="/team/*" element={<TeamSpace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
