import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, MessageSquare, Users } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/tasks', icon: FileText, label: 'Tasks' },
  { path: '/notes', icon: FileText, label: 'Notes' },
  { path: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { path: '/interview', icon: Users, label: 'Interview' },
  { path: '/team', icon: Users, label: 'Team' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Super Study</h1>
      </div>
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const activeClass = isActive 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ' + activeClass}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
