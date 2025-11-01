import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthForm } from "./components/auth/AuthForm";
import { Sidebar } from "./components/layout/Sidebar";
import { AppRouter } from "./components/router/AppRouter";
import { realTimeAuth } from "./utils/realTimeAuth";
import { User } from "./types";
import { Menu, X } from "lucide-react";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log("🔐 Setting up auth state listener...");
    const unsubscribe = realTimeAuth.onAuthStateChange((currentUser) => {
      console.log("👤 Auth state changed:", { authenticated: !!currentUser, userId: currentUser?.id });
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
    });

    return unsubscribe;
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAuthSuccess = () => {
    console.log("🎉 Auth success handler called");
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      console.log("🔄 Starting logout process...");
      await realTimeAuth.logout();
      console.log("✅ Logout successful");
      setIsAuthenticated(false);
      setUser(null);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <Router>
      <div className="h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="mobile-header lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between relative z-30">
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity min-w-0 flex-1"
          >
            <img
              src="/SuperApp.png"
              alt="Super Study Logo"
              className="w-8 h-8 object-contain flex-shrink-0"
              onError={(e) => {
                console.error("Logo failed to load:", e);
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-lg font-bold text-gray-900 truncate">
              Super Study
            </span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:relative lg:block lg:w-64 lg:flex-shrink-0 z-30 h-full
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            transition-transform duration-300 ease-in-out
          `}
        >
          <Sidebar
            onLogout={handleLogout}
            isMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-auto">
          <AppRouter />
        </div>
      </div>
    </Router>
  );
}

export default App;
