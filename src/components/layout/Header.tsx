import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const Header: React.FC = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

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
            onClick={signOutUser}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:from-red-600 hover:to-pink-600 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
