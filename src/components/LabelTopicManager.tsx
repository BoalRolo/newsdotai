import { useState, useEffect } from "react";
import { useNews } from "../hooks/useNews";
import NewsDisplay from "./NewsDisplay";

export default function LabelTopicManager() {
  const [label, setLabel] = useState("");
  const [topic, setTopic] = useState("");
  const [items, setItems] = useState<{ label: string; topic: string }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });

  const {
    topicsWithNews,
    isLoading,
    error,
    fetchNews,
    clearNews,
    isApiKeyConfigured,
  } = useNews();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAdd = () => {
    if (!label || !topic) return;
    setItems([...items, { label, topic }]);
    setLabel("");
    setTopic("");
  };

  const handleFetchNews = async () => {
    console.log("🔘 Button clicked: handleFetchNews");
    console.log("📋 Current items:", items);

    if (items.length === 0) {
      console.log("❌ No items to search");
      return;
    }

    console.log("🚀 Starting news fetch...");
    await fetchNews(items);
  };

  const handleClearAll = () => {
    setItems([]);
    clearNews();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-500 ${
        isDarkMode ? "text-white" : "text-slate-900"
      }`}
    >
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-lg shadow-blue-500/25"
                  : "bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 shadow-lg shadow-blue-500/30"
              }`}
            >
              <div className="w-6 h-6 border-2 border-white/80 rounded-sm"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
            </div>
            <div>
              <h1
                className={`text-3xl font-bold tracking-tight transition-all duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent"
                }`}
              >
                NEWS.AI
              </h1>
              <p
                className={`text-sm font-medium transition-colors duration-500 ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Intelligent News Curation
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 group ${
              isDarkMode
                ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-white"
                : "bg-white/80 border border-slate-200/50 hover:bg-white text-slate-700 shadow-lg"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  isDarkMode ? "bg-yellow-400" : "bg-slate-600"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {isDarkMode ? "LIGHT" : "DARK"}
              </span>
            </div>
            <div
              className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  : "bg-gradient-to-r from-transparent via-slate-500/5 to-transparent"
              }`}
            ></div>
          </button>
        </div>

        {/* Main Content */}
        <div
          className={`p-8 rounded-3xl transition-all duration-500 ${
            isDarkMode
              ? "bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/20"
              : "bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl shadow-slate-200/50"
          }`}
        >
          <div className="space-y-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 transition-colors duration-500 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  TOPIC LABEL
                </label>
                <input
                  type="text"
                  placeholder="Enter topic keywords..."
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    isDarkMode
                      ? "bg-slate-700/50 text-white border-slate-600/50 placeholder-slate-400 focus:border-blue-500/50"
                      : "bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-500 focus:border-blue-500"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 transition-colors duration-500 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  CATEGORY
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    isDarkMode
                      ? "bg-slate-700/50 text-white border-slate-600/50 focus:border-blue-500/50"
                      : "bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500"
                  }`}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Sports">Sports</option>
                  <option value="Politics">Politics</option>
                  <option value="Science">Science</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAdd}
                disabled={!label || !topic}
                className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-600 disabled:from-slate-700 disabled:via-slate-600 disabled:to-slate-700 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-400 hover:via-purple-400 hover:to-indigo-500 disabled:from-slate-300 disabled:via-slate-200 disabled:to-slate-300 text-white shadow-lg shadow-blue-500/30"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/80 rounded-sm"></div>
                  <span>ADD TOPIC</span>
                </div>
              </button>

              <button
                onClick={handleFetchNews}
                disabled={
                  items.length === 0 || isLoading || !isApiKeyConfigured
                }
                className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 hover:from-green-500 hover:via-emerald-500 hover:to-teal-600 disabled:from-slate-700 disabled:via-slate-600 disabled:to-slate-700 text-white shadow-lg shadow-green-500/25"
                    : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-400 hover:via-emerald-400 hover:to-teal-500 disabled:from-slate-300 disabled:via-slate-200 disabled:to-slate-300 text-white shadow-lg shadow-green-500/30"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                  <span>{isLoading ? "SEARCHING..." : "SEARCH NEWS"}</span>
                </div>
              </button>

              <button
                onClick={handleClearAll}
                disabled={items.length === 0 && topicsWithNews.length === 0}
                className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? "bg-gradient-to-r from-red-600 via-pink-600 to-rose-700 hover:from-red-500 hover:via-pink-500 hover:to-rose-600 disabled:from-slate-700 disabled:via-slate-600 disabled:to-slate-700 text-white shadow-lg shadow-red-500/25"
                    : "bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 hover:from-red-400 hover:via-pink-400 hover:to-rose-500 disabled:from-slate-300 disabled:via-slate-200 disabled:to-slate-300 text-white shadow-lg shadow-red-500/30"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>CLEAR ALL</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* API Key Warning */}
        {!isApiKeyConfigured && (
          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode
                ? "bg-yellow-900/20 border-yellow-700/50 text-yellow-300"
                : "bg-yellow-50 border-yellow-200 text-yellow-700"
            }`}
          >
            <p className="font-medium">⚠️ API Key Required</p>
            <p className="text-sm mt-1">
              Please add your NewsData.io API key to the environment variables
              (VITE_NEWSDATA_API_KEY)
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode
                ? "bg-red-900/20 border-red-700/50 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Topics List */}
        {items.length > 0 && (
          <div
            className={`p-6 rounded-3xl transition-all duration-500 ${
              isDarkMode
                ? "bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/20"
                : "bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl shadow-slate-200/50"
            }`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? "bg-green-400" : "bg-green-500"
                }`}
              ></div>
              <h2
                className={`text-lg font-bold transition-colors duration-500 ${
                  isDarkMode ? "text-slate-200" : "text-slate-800"
                }`}
              >
                ACTIVE TOPICS
              </h2>
              <div
                className={`flex-1 h-px ${
                  isDarkMode ? "bg-slate-600" : "bg-slate-300"
                }`}
              ></div>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl flex justify-between items-center transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode
                      ? "bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700/70"
                      : "bg-slate-50 border border-slate-200 hover:bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isDarkMode ? "bg-blue-400" : "bg-blue-500"
                      }`}
                    ></div>
                    <span
                      className={`font-semibold transition-colors duration-300 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                      isDarkMode
                        ? "text-slate-300 bg-slate-600/50"
                        : "text-slate-600 bg-slate-200"
                    }`}
                  >
                    {item.topic}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News Display */}
        <NewsDisplay topicsWithNews={topicsWithNews} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
