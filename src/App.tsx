import { useState, useEffect } from "react";
import { AuthForm } from "./components/auth/AuthForm";
import { realTimeAuth } from "./utils/realTimeAuth";
import { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("🔐 Setting up auth state listener...");
    const unsubscribe = realTimeAuth.onAuthStateChange((currentUser) => {
      console.log("👤 Auth state changed:", { user: !!currentUser, userId: currentUser?.id });
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
    });

    return unsubscribe;
  }, []);

  const handleAuthSuccess = () => {
    console.log("🎉 Auth success handler called");
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Super Study App!
        </h1>
        <p className="text-gray-600 mb-4">
          Hello, {user?.username}!
        </p>
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Authentication Successful ✅
          </p>
          <p className="text-sm text-gray-600">
            You're logged in with: {user?.email}
          </p>
        </div>
        <button
          onClick={async () => {
            await realTimeAuth.logout();
            setIsAuthenticated(false);
            setUser(null);
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
