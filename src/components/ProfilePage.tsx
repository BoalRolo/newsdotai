import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "./ThemeContext";
import "../styles/ui.css";

export const ProfilePage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.email?.split("@")[0] || "");

  // Placeholder avatar (could be replaced with user photoURL)
  const avatarUrl =
    user?.photoURL ||
    "https://ui-avatars.com/api/?name=" +
      (user?.email?.[0]?.toUpperCase() || "U");

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-500 relative z-1 ${
        isDarkMode
          ? "bg-glass-gradient text-white"
          : "bg-glass-gradient-light text-slate-900"
      }`}
    >
      <div
        className={`card-glass${!isDarkMode ? "-light" : ""} w-full max-w-md`}
      >
        {/* Profile Card Content */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover mb-4 shadow"
          />
          <h2
            className={
              isDarkMode
                ? "text-2xl font-bold mb-1"
                : "text-2xl font-bold mb-1 text-slate-900"
            }
          >
            {username}
          </h2>
          <p
            className={
              isDarkMode
                ? "text-slate-500 dark:text-slate-300 text-sm mb-2"
                : "text-slate-600 text-sm mb-2"
            }
          >
            {user?.email}
          </p>
          <button className="text-blue-600 hover:underline text-sm font-medium mb-4">
            Upload New Photo
          </button>
          <div className="w-full border-t border-slate-200 dark:border-slate-700 my-4"></div>
          <div className="w-full flex flex-col items-center">
            <span
              className={
                isDarkMode
                  ? "text-xs text-slate-400 mb-1"
                  : "text-xs text-slate-600 mb-1"
              }
            >
              Last login
            </span>
            <span
              className={
                isDarkMode
                  ? "text-xs text-slate-500 dark:text-slate-300"
                  : "text-xs text-slate-600"
              }
            >
              (placeholder date)
            </span>
          </div>
        </div>
        {/* Theme Card */}
        <section
          className={`mb-6 rounded-2xl border ${
            isDarkMode
              ? "bg-slate-800/30 border-slate-700"
              : "bg-white/90 border-slate-200"
          } p-6`}
        >
          <h3
            className={
              isDarkMode
                ? "text-lg font-bold mb-1"
                : "text-lg font-bold mb-1 text-slate-900"
            }
          >
            Theme
          </h3>
          <div className="flex items-center justify-between">
            <p
              className={
                isDarkMode
                  ? "text-slate-500 dark:text-slate-300 text-sm"
                  : "text-slate-600 text-sm"
              }
            >
              Switch between light and dark mode.
            </p>
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className={`ml-4 p-2 rounded-full ${
                isDarkMode ? "bg-slate-800" : "bg-slate-200"
              } transition-colors duration-200 focus:outline-none border border-slate-300`}
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
        </section>
        {/* Username Card */}
        <section
          className={`mb-6 rounded-2xl border ${
            isDarkMode
              ? "bg-slate-800/30 border-slate-700"
              : "bg-white/90 border-slate-200"
          } p-6`}
        >
          <h3
            className={
              isDarkMode
                ? "text-lg font-bold mb-1"
                : "text-lg font-bold mb-1 text-slate-900"
            }
          >
            Change Username
          </h3>
          <label
            htmlFor="username"
            className={
              isDarkMode
                ? "block text-sm font-medium mb-2"
                : "block text-sm font-medium mb-2 text-slate-900"
            }
          >
            New username
          </label>
          <input
            id="username"
            type="text"
            className={
              isDarkMode
                ? "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                : "input-light mb-4"
            }
            placeholder="New username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className={
              isDarkMode ? "btn-primary mt-2" : "btn-primary-light mt-2"
            }
          >
            Save
          </button>
        </section>
        {/* Password Card */}
        <section
          className={`rounded-2xl border ${
            isDarkMode
              ? "bg-slate-800/30 border-slate-700"
              : "bg-white/90 border-slate-200"
          } p-6`}
        >
          <h3
            className={
              isDarkMode
                ? "text-lg font-bold mb-1"
                : "text-lg font-bold mb-1 text-slate-900"
            }
          >
            Change Password
          </h3>
          <label
            className={
              isDarkMode
                ? "block text-sm font-medium mb-2"
                : "block text-sm font-medium mb-2 text-slate-900"
            }
          >
            Update your account password securely.
          </label>
          <button
            className={
              isDarkMode ? "btn-primary mt-2" : "btn-primary-light mt-2"
            }
          >
            Change Password
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
