import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "./ThemeContext";

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(db, "users", user.uid),
        (doc) => {
          if (doc.exists()) {
            setUsername(doc.data().username || "");
          }
        },
        (error) => {
          console.error("Error fetching username:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-900/80 border-slate-700"
          : "bg-white/80 border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/home"
            className={`text-xl font-bold transition-colors duration-200 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            NEWS.AI
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/home"
              className={`transition-colors duration-200 ${
                location.pathname === "/home"
                  ? isDarkMode
                    ? "text-blue-400"
                    : "text-blue-600"
                  : isDarkMode
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Home
            </Link>
            <Link
              to="/mytopics"
              className={`transition-colors duration-200 ${
                location.pathname === "/mytopics"
                  ? isDarkMode
                    ? "text-blue-400"
                    : "text-blue-600"
                  : isDarkMode
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Topics
            </Link>
          </nav>

          {/* Right side - Theme and Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? "hover:bg-slate-800 text-slate-300"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <span className="text-lg">☀️</span>
              ) : (
                <span className="text-lg">🌙</span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "hover:bg-slate-800 text-slate-300"
                    : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {username?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <span className="hidden sm:block font-medium">
                  {username || user?.email}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg border transition-all duration-200 ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className={`flex items-center px-4 py-3 transition-colors duration-200 ${
                        isDarkMode
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors duration-200 ${
                        isDarkMode
                          ? "text-red-400 hover:bg-red-900/20"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;
