import React from "react";
import { useTheme } from "./ThemeContext";

const ProfilePageTest: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-10 bg-red-500 dark:bg-green-500 z-50"></div>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-500">
        <h1 className="text-3xl font-bold mb-4">Profile Page Test</h1>
        <p className="mb-8">
          This is a minimal test for dark/light mode using only Tailwind
          classes.
        </p>
        <button
          onClick={toggleDarkMode}
          className="px-6 py-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
        >
          Toggle Dark Mode ({isDarkMode ? "Dark" : "Light"})
        </button>
      </div>
    </>
  );
};

export default ProfilePageTest;
