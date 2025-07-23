import React, { useState, useEffect, forwardRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../components/layout/ThemeContext";
import "../styles/ui.css";

const CustomDateInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; placeholder?: string }
>(({ value, onClick, placeholder }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 text-white border-slate-600/50 placeholder-slate-400 focus:border-blue-500/50 dark:bg-slate-700/50 dark:text-white dark:border-slate-600/50 dark:placeholder-slate-400 dark:focus:border-blue-500/50`}
    style={{ textAlign: "left", width: "100%", height: "48px" }}
  >
    {value || placeholder}
  </button>
));
CustomDateInput.displayName = "CustomDateInput";

const LoginPage: React.FC = () => {
  const { user, loading, error, signIn } = useAuth();
  const { isDarkMode } = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      document.getElementById("root")?.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      document.getElementById("root")?.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Add dark class to datepicker popper
    const interval = setInterval(() => {
      const popper = document.querySelector(".react-datepicker-popper");
      if (popper) {
        if (isDarkMode) popper.classList.add("dark");
        else popper.classList.remove("dark");
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!identifier || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }
    await signIn(identifier, password);
  };

  if (user) {
    return null;
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-500 relative z-1 ${
        isDarkMode ? "text-white dark" : "text-slate-900"
      }`}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-2">
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
              Sign in to your account
            </p>
          </div>
        </div>
        {/* Card */}
        <div className="card-glass">
          <h2
            className={`mb-6 text-2xl font-bold text-center bg-gradient-to-r ${
              isDarkMode
                ? "from-white via-gray-200 to-gray-400"
                : "from-slate-900 via-slate-700 to-slate-600"
            } bg-clip-text text-transparent`}
          >
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                isDarkMode
                  ? "bg-slate-700/50 text-white border-slate-600/50 placeholder-slate-400 focus:border-blue-500/50"
                  : "bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-500 focus:border-blue-500"
              }`}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                isDarkMode
                  ? "bg-slate-700/50 text-white border-slate-600/50 placeholder-slate-400 focus:border-blue-500/50"
                  : "bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-500 focus:border-blue-500"
              }`}
              required
            />
            {(localError || error) && (
              <div className="text-red-500 text-sm">{localError || error}</div>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Loading..." : "Sign In"}
            </button>
            <div className="mt-4 text-center">
              <Link to="/signup" className="text-blue-600 hover:underline">
                Don't have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
