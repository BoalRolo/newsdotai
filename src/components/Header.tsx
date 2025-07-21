import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "./ThemeContext";

const Header: React.FC = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Fetch username from Firestore if available
  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        } else {
          setUsername(null);
        }
      }
    };
    fetchUsername();
  }, [user]);

  // Placeholder avatar (could be replaced with user photoURL)
  const avatarUrl =
    user?.photoURL ||
    "https://ui-avatars.com/api/?name=" +
      (username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U");

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 shadow-lg z-10">
      {/* App Title/Logo */}
      <div
        className="flex items-center space-x-3 cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent select-none">
          NEWS.AI
        </span>
      </div>
      {/* Profile Section */}
      <div className="flex items-center space-x-3">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => navigate("/profile")}
        >
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover"
          />
          <span className="font-semibold text-white hidden sm:block">
            {username || user?.email?.split("@")[0] || "Profile"}
          </span>
        </button>
        {/* Sign out button */}
        {user && (
          <button
            onClick={async () => {
              await signOutUser();
              navigate("/");
            }}
            className="ml-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-200 focus:outline-none"
          >
            Sign Out
          </button>
        )}
        {/* Dark mode toggle button */}
        <button
          onClick={toggleDarkMode}
          className="ml-2 p-2 rounded-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none border border-slate-600"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <span role="img" aria-label="Light mode">
              ☀️
            </span>
          ) : (
            <span role="img" aria-label="Dark mode">
              🌙
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
