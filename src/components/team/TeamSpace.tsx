import React from "react";
import { Users, AlertCircle, Rocket } from "lucide-react";

export const TeamSpace: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20">
          <div className="mb-8 flex justify-center">
            <div className="bg-teal-100 p-6 rounded-full">
              <Users className="w-16 h-16 text-teal-600" />
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Rocket className="w-8 h-8 text-teal-500" />
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              Coming Soon
            </h1>
          </div>
          
          <p className="text-2xl text-gray-600 mb-4">
            Team Space is Under Development
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-teal-100 mt-8">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-8 h-8 text-teal-500 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Yet to Build
                </h3>
                <p className="text-gray-600 mb-4">
                  We're building a collaborative team space with:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Real-time collaboration tools</li>
                  <li>Project management and task tracking</li>
                  <li>Video meetings and screen sharing</li>
                  <li>Shared documents and file storage</li>
                  <li>Team chat and notifications</li>
                </ul>
                <p className="mt-6 text-teal-600 font-semibold">
                  Stay tuned! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
