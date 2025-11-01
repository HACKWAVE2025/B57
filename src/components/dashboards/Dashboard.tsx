import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CheckSquare,
  StickyNote,
  MessageSquare,
  Brain,
  BookOpen,
  Briefcase,
  Users,
  TrendingUp,
  Calendar,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { realTimeAuth } from "../../utils/realTimeAuth";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = realTimeAuth.getCurrentUser();

  const quickLinks = [
    { icon: FileText, label: "File Manager", path: "/files", color: "bg-blue-500" },
    { icon: CheckSquare, label: "To-Do List", path: "/tasks", color: "bg-green-500" },
    { icon: StickyNote, label: "Short Notes", path: "/notes", color: "bg-yellow-500" },
    { icon: Calendar, label: "Calendar", path: "/calendar", color: "bg-red-500" },
    { icon: Sparkles, label: "Journal", path: "/journal", color: "bg-cyan-500" },
    { icon: MessageSquare, label: "AI Assistant", path: "/chat", color: "bg-purple-500" },
    { icon: Brain, label: "Study Tools", path: "/tools", color: "bg-indigo-500" },
    { icon: BookOpen, label: "Flash Cards", path: "/flashcards", color: "bg-pink-500" },
    { icon: MessageCircle, label: "Community", path: "/community", color: "bg-emerald-500" },
    { icon: Briefcase, label: "Interview Prep", path: "/interview", color: "bg-orange-500" },
    { icon: Users, label: "Team Space", path: "/team", color: "bg-teal-500" },
  ];

  const stats = [
    { label: "Total Files", value: "0", icon: FileText },
    { label: "Tasks", value: "0", icon: CheckSquare },
    { label: "Notes", value: "0", icon: StickyNote },
    { label: "Active Projects", value: "0", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || "User"}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your productivity dashboard. Let's make today productive!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all transform hover:scale-105 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${link.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <link.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {link.label}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <p className="text-gray-500 text-center py-8">
            No recent activity yet. Start by creating a task or uploading a file!
          </p>
        </div>
      </div>
    </div>
  );
};
