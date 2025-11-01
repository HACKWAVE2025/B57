<<<<<<< HEAD
export default function InterviewPrep() {
  return (
    <div>
      <h1>Interview Prep</h1>
    </div>
  );
}

=======
import React from "react";
import { Briefcase, AlertCircle, Rocket } from "lucide-react";

export const InterviewPrep: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20">
          <div className="mb-8 flex justify-center">
            <div className="bg-orange-100 p-6 rounded-full">
              <Briefcase className="w-16 h-16 text-orange-600" />
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Rocket className="w-8 h-8 text-orange-500" />
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              Coming Soon
            </h1>
          </div>
          
          <p className="text-2xl text-gray-600 mb-4">
            Interview Prep is Under Development
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-100 mt-8">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-8 h-8 text-orange-500 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Yet to Build
                </h3>
                <p className="text-gray-600 mb-4">
                  We're working hard to bring you an amazing interview preparation experience with:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>AI-powered mock interviews</li>
                  <li>Behavioral and technical question banks</li>
                  <li>Real-time feedback and scoring</li>
                  <li>Practice sessions with video recording</li>
                  <li>Personalized preparation plans</li>
                </ul>
                <p className="mt-6 text-orange-600 font-semibold">
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
>>>>>>> 9bbd3282805925cfeba9b9fa7805e06679a691fc
