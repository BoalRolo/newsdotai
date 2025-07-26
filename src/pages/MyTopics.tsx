import { useState } from "react";
import { useNews } from "../hooks/useNews";
import { useUserTopics } from "../hooks/useUserTopics";
import NewsDisplay from "../components/common/NewsDisplay";
import CustomDropdown from "../components/common/CustomDropdown";
import { useTheme } from "../components/layout/ThemeContext";
import "../styles/ui.css";

export default function MyTopics() {
  const { isDarkMode } = useTheme();
  const [label, setLabel] = useState("");
  const [topic, setTopic] = useState("");
  const [useMockData, setUseMockData] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editTopic, setEditTopic] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Hook para gerenciar tópicos do usuário no Firestore
  const {
    topics: items,
    loading: topicsLoading,
    error: topicsError,
    addTopic,
    editTopic: editTopicInFirestore,
    deleteTopic,
    clearError: clearTopicsError,
  } = useUserTopics();

  const {
    topicsWithNews,
    isLoading,
    error,
    fetchNews,
    clearNews,
    isApiKeyConfigured,
  } = useNews();

  const handleAdd = async () => {
    if (!label || !topic) return;

    // Check if label already exists
    const labelExists = items.some(
      (item) => item.label.toLowerCase() === label.toLowerCase()
    );

    if (labelExists) {
      setErrorMessage(
        "This label already exists! Please use a different label."
      );
      // Clear error message after 3 seconds
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      await addTopic(label, topic);
      setLabel("");
      setTopic("");
      if (errorMessage) setErrorMessage("");
    } catch (err) {
      setErrorMessage("Failed to add topic. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleFetchNews = async () => {
    if (items.length === 0) return;
    await fetchNews(items, useMockData, true); // Sempre guarda no backend
  };

  const handleClearAll = () => {
    clearNews();
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditLabel(items[index].label);
    setEditTopic(items[index].topic);
  };

  const handleSaveEdit = async () => {
    if (editingIndex !== null && editLabel && editTopic) {
      try {
        const topicToEdit = items[editingIndex];
        await editTopicInFirestore(topicToEdit.id, editLabel, editTopic);
        setEditingIndex(null);
        setEditLabel("");
        setEditTopic("");
        if (errorMessage) setErrorMessage("");
      } catch (err) {
        setErrorMessage("Failed to update topic. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditLabel("");
    setEditTopic("");
  };

  const handleDelete = async (index: number) => {
    try {
      const topicToDelete = items[index];
      await deleteTopic(topicToDelete.id);
      if (errorMessage) setErrorMessage("");
    } catch (err) {
      setErrorMessage("Failed to delete topic. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Clear error messages when topics error changes
  if (topicsError && !errorMessage) {
    setErrorMessage(topicsError);
    setTimeout(() => {
      setErrorMessage("");
      clearTopicsError();
    }, 3000);
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-500 relative z-1 ${
        isDarkMode
          ? "bg-glass-gradient text-white"
          : "bg-glass-gradient-light text-slate-900"
      }`}
    >
      <div
        className={`card-glass${
          !isDarkMode ? "-light" : ""
        } w-full max-w-2xl space-y-8`}
      >
        {/* Mock Data Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setUseMockData(!useMockData)}
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 group ${
              useMockData
                ? "bg-purple-600/80 border border-purple-500/50 hover:bg-purple-500/80 text-white"
                : isDarkMode
                ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-white"
                : "bg-white/80 border border-slate-200/50 hover:bg-white text-slate-700 shadow-lg"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  useMockData ? "bg-purple-300" : "bg-slate-400"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {useMockData ? "MOCKi" : "API"}
              </span>
            </div>
            <div
              className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                useMockData
                  ? "bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
                  : isDarkMode
                  ? "bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  : "bg-gradient-to-r from-transparent via-slate-500/5 to-transparent"
              }`}
            ></div>
          </button>
        </div>

        {/* Main Content */}
        <div
          className={`space-y-6 rounded-2xl border ${
            isDarkMode
              ? "bg-slate-800/30 border-slate-700"
              : "bg-white/90 border-slate-200 shadow"
          } p-6`}
        >
          {/* Input Fields */}
          <div className="space-y-4">
            <label
              className={
                isDarkMode
                  ? "block text-sm font-bold mb-2"
                  : "block text-sm font-bold mb-2 text-slate-900"
              }
              htmlFor="topic-label"
            >
              TOPIC LABEL
            </label>
            <input
              id="topic-label"
              type="text"
              placeholder="Enter topic keywords..."
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className={
                isDarkMode
                  ? "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  : "input-light"
              }
            />
            <label
              className={
                isDarkMode
                  ? "block text-sm font-bold mb-2"
                  : "block text-sm font-bold mb-2 text-slate-900"
              }
              htmlFor="category"
            >
              CATEGORY
            </label>
            <CustomDropdown
              options={[
                { value: "Technology", label: "Technology" },
                { value: "Finance", label: "Finance" },
                { value: "Sports", label: "Sports" },
                { value: "Politics", label: "Politics" },
                { value: "Science", label: "Science" },
                ...(useMockData
                  ? [
                      {
                        value: "sportingcp",
                        label: "Sporting CP",
                        isMock: true,
                      },
                      {
                        value: "technology",
                        label: "Technology",
                        isMock: true,
                      },
                      {
                        value: "business",
                        label: "Business",
                        isMock: true,
                      },
                      {
                        value: "politics",
                        label: "Politics",
                        isMock: true,
                      },
                      {
                        value: "entertainment",
                        label: "Entertainment",
                        isMock: true,
                      },
                    ]
                  : []),
              ]}
              value={topic}
              onChange={(value) => {
                setTopic(value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Select category"
              isDarkMode={isDarkMode}
            />
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mt-6">
            <button
              onClick={handleAdd}
              disabled={!label || !topic || topicsLoading}
              className={isDarkMode ? "btn-primary" : "btn-primary-light"}
            >
              <div className="flex items-center justify-center space-x-2">
                {topicsLoading ? (
                  <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div
                    className={`w-5 h-5 border-2 rounded-sm ${
                      isDarkMode ? "border-white/80" : "border-white/90"
                    }`}
                  ></div>
                )}
                <span>{topicsLoading ? "ADDING..." : "ADD TOPIC"}</span>
              </div>
            </button>
            <button
              onClick={handleFetchNews}
              disabled={
                items.length === 0 ||
                isLoading ||
                (!isApiKeyConfigured && !useMockData)
              }
              className={isDarkMode ? "btn-primary" : "btn-primary-light"}
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
              className={isDarkMode ? "btn-primary" : "btn-primary-light"}
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

        {/* Error Message */}
        {errorMessage && (
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              isDarkMode
                ? "bg-red-900/20 border-red-700/50 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center space-x-2">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Spacer for dropdown clearance */}
        <div className="h-4"></div>

        {/* Backend Connection Warning */}
        {!isApiKeyConfigured && (
          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode
                ? "bg-yellow-900/20 border-yellow-700/50 text-yellow-300"
                : "bg-yellow-50 border-yellow-200 text-yellow-700"
            }`}
          >
            <p className="font-medium">⚠️ Backend Connection Required</p>
            <p className="text-sm mt-1">
              Unable to connect to the news service. Please check if the backend
              is running.
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <p className="font-medium">⚠️ Connection Error</p>
            <p className="text-sm mt-1">
              Unable to connect to the news service. Please try again later.
            </p>
          </div>
        )}

        {/* Topics List */}
        {items.length > 0 && (
          <div
            className={`mt-8 p-6 rounded-3xl ${
              isDarkMode
                ? "bg-slate-800/30 border border-slate-700 text-white"
                : "bg-white/90 border border-slate-200 text-slate-900 shadow"
            } transition-all duration-500 relative z-1`}
          >
            <div className="flex items-center space-x-3 mb-6 relative z-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? "bg-green-400" : "bg-green-500"
                }`}
              ></div>
              <h2
                className={`text-lg font-bold transition-colors duration-500 relative z-1 ${
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
                  key={item.id}
                  className={`p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    isDarkMode
                      ? "bg-slate-800/30 border border-slate-700 text-white"
                      : "bg-white/90 border border-slate-200 text-slate-900 shadow"
                  }`}
                >
                  {editingIndex === idx ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isDarkMode ? "bg-yellow-400" : "bg-yellow-500"
                            }`}
                          ></div>
                          <span
                            className={`text-sm font-medium transition-colors duration-300 ${
                              isDarkMode ? "text-yellow-300" : "text-yellow-600"
                            }`}
                          >
                            EDITING
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            disabled={!editLabel || !editTopic}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed ${
                              isDarkMode
                                ? "bg-green-600/80 text-white hover:bg-green-500/80 disabled:bg-slate-600/50 disabled:text-slate-400"
                                : "bg-green-500 text-white hover:bg-green-400 disabled:bg-slate-200 disabled:text-slate-400"
                            }`}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                              isDarkMode
                                ? "bg-slate-600/50 text-slate-300 hover:bg-slate-500/50"
                                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className={`block text-xs font-medium mb-1 transition-colors duration-300 ${
                              isDarkMode ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            TOPIC LABEL
                          </label>
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
                              isDarkMode
                                ? "bg-slate-600/50 text-white border-slate-500/50 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                                : "bg-white text-slate-900 border-slate-300 focus:border-yellow-500 focus:ring-yellow-500/20"
                            }`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-xs font-medium mb-1 transition-colors duration-300 ${
                              isDarkMode ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            CATEGORY
                          </label>
                          <CustomDropdown
                            options={[
                              { value: "Technology", label: "Technology" },
                              { value: "Finance", label: "Finance" },
                              { value: "Sports", label: "Sports" },
                              { value: "Politics", label: "Politics" },
                              { value: "Science", label: "Science" },
                              ...(useMockData
                                ? [
                                    {
                                      value: "sportingcp",
                                      label: "Sporting CP",
                                      isMock: true,
                                    },
                                    {
                                      value: "technology",
                                      label: "Technology",
                                      isMock: true,
                                    },
                                    {
                                      value: "business",
                                      label: "Business",
                                      isMock: true,
                                    },
                                    {
                                      value: "politics",
                                      label: "Politics",
                                      isMock: true,
                                    },
                                    {
                                      value: "entertainment",
                                      label: "Entertainment",
                                      isMock: true,
                                    },
                                  ]
                                : []),
                            ]}
                            value={editTopic}
                            onChange={setEditTopic}
                            placeholder="Select category"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex justify-between items-center">
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
                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                            isDarkMode
                              ? "text-slate-300 bg-slate-600/50"
                              : "text-slate-600 bg-slate-200"
                          }`}
                        >
                          {item.topic}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(idx)}
                            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                              isDarkMode
                                ? "text-blue-400 hover:bg-blue-600/20"
                                : "text-blue-600 hover:bg-blue-50"
                            }`}
                            title="Edit topic"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(idx)}
                            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                              isDarkMode
                                ? "text-red-400 hover:bg-red-600/20"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                            title="Delete topic"
                          >
                            <svg
                              className="w-4 h-4"
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
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
