import React from "react";
import { Link } from "react-router-dom";

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2">
        {icon}
      </span>
      <span className="text-xs text-white/80">{label}</span>
    </div>
  );
}

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] px-8 py-32 flex flex-col md:flex-row items-center justify-between overflow-hidden">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-900 opacity-30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full blur-2xl" />
      </div>
      <div className="relative z-10 max-w-2xl space-y-10 md:space-y-12">
        <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-xl">
          Stay Ahead with <span className="text-blue-400">NEWS.AI</span>
        </h1>
        <p className="text-gray-200 text-2xl md:text-3xl font-medium max-w-xl drop-shadow">
          Get personalized, real-time news from top sources. Rephrased by AI.
          Delivered beautifully.
        </p>
        <Link
          to="/mytopics"
          className="inline-block bg-blue-500 text-white px-10 py-5 rounded-xl text-xl font-semibold shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
        >
          Explore My News Feed
        </Link>
        <div className="flex space-x-8 pt-10">
          <Feature
            icon={
              <svg
                className="w-10 h-10"
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
                className="w-10 h-10"
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
                className="w-10 h-10"
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
      <div className="relative z-10 mt-16 md:mt-0 w-full md:w-2/3 flex justify-center items-center">
        <img
          src="/ai-news.png"
          alt="AI Illustration"
          className="max-w-2xl w-full drop-shadow-2xl rounded-3xl border-4 border-blue-900/30 bg-white/10"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x400?text=AI+News";
          }}
        />
      </div>
    </div>
  );
};

export default Home;
