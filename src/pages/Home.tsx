import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/layout/ThemeContext";

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2">
        {icon}
      </span>
      <span className="text-xs opacity-80">{label}</span>
    </div>
  );
}

const Home: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 py-12 transition-all duration-500 ${
        isDarkMode
          ? "bg-glass-gradient text-white"
          : "bg-glass-gradient-light text-slate-900"
      }`}
    >
      {/* Subtle background overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-900 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500 opacity-10 rounded-full blur-2xl" />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-12 md:gap-20">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-8 md:space-y-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-xl">
            Stay Ahead with{" "}
            <span className="text-blue-500 dark:text-blue-400">NEWS.AI</span>
          </h1>
          <p className="text-lg md:text-2xl font-medium max-w-xl drop-shadow opacity-90">
            Get personalized, real-time news from top sources. Rephrased by AI.
            Delivered beautifully.
          </p>
          <Link
            to="/mytopics"
            className="inline-block bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
          >
            Explore My News Feed
          </Link>
          <div className="flex space-x-8 pt-6 md:pt-10 justify-center md:justify-start">
            <Feature
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v18h18"
                  />
                </svg>
              }
              label="Analytics"
            />
            <Feature
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 3v18M4 21V3m14 18V8m-7 13h7"
                  />
                </svg>
              }
              label="Reports"
            />
            <Feature
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
              label="Verified"
            />
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center w-full max-w-xl">
          <img
            src={isDarkMode ? "/ai-news-dark.png" : "/ai-news-light.png"}
            alt="AI Illustration"
            className="max-w-md w-full drop-shadow-2xl rounded-3xl border-4 border-blue-900/20 bg-white/10 dark:bg-slate-800/30 transition-all duration-500"
            onError={(e) => {
              // Verificar se o elemento ainda existe antes de tentar aceder
              if (e.currentTarget) {
                // Fallback para imagem única se as específicas não existirem
                e.currentTarget.src = "/ai-news.png";
                // Se nem a imagem única existir, usa placeholder
                e.currentTarget.onerror = () => {
                  if (e.currentTarget) {
                    e.currentTarget.src =
                      "https://placehold.co/600x400?text=AI+News";
                  }
                };
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
