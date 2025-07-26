import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/layout/ThemeContext";
import "../styles/ui.css";

function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("One number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
  return errors;
}

const SignUp: React.FC = () => {
  const { user, loading, error, signUp, signIn } = useAuth();
  const { isDarkMode } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    null | "checking" | "taken" | "available"
  >(null);
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Live username check
  useEffect(() => {
    if (!isSignUp || !username) {
      setUsernameStatus(null);
      return;
    }
    let active = true;
    setUsernameStatus("checking");
    const check = setTimeout(async () => {
      console.log(
        "CHECKING AVAILABILITY FOR:",
        username,
        "(lowercased:",
        username.toLowerCase(),
        ")"
      );
      // Verificação case-insensitive
      const ref = doc(db, "usernames", username.toLowerCase());
      console.log("Checking username", username);
      const snap = await getDoc(ref);
      if (!active) return;
      setUsernameStatus(snap.exists() ? "taken" : "available");
    }, 500);
    return () => {
      active = false;
      clearTimeout(check);
    };
  }, [username, isSignUp]);

  const passwordErrors = isSignUp ? validatePassword(password) : [];

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
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (isSignUp) {
      if (!username || !dob || !email || !password || !retypePassword) {
        setLocalError("Please fill in all fields.");
        return;
      }
      if (usernameStatus === "taken") {
        setLocalError("Username already taken.");
        return;
      }
      if (password !== retypePassword) {
        setLocalError("Passwords do not match.");
        return;
      }
      if (passwordErrors.length > 0) {
        setLocalError("Password does not meet requirements.");
        return;
      }
      await signUp({
        username,
        dob: dob,
        email,
        password,
      });
    } else {
      if (!identifier || !password) {
        setLocalError("Please fill in all fields.");
        return;
      }
      await signIn(identifier, password);
    }
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
              {isSignUp ? "Create your account" : "Sign in to your account"}
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
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp ? (
              <>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username.toLowerCase()}
                    onChange={(e) => {
                      console.log("USERNAME INPUT:", e.target.value);
                      setUsername(e.target.value);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                      isDarkMode
                        ? "bg-slate-700/50 text-white border-slate-600/50 placeholder-slate-400 focus:border-blue-500/50"
                        : "bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-500 focus:border-blue-500"
                    }`}
                    required
                  />
                  {username && (
                    <span
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${
                        usernameStatus === "checking"
                          ? "text-yellow-500"
                          : usernameStatus === "taken"
                          ? "text-red-500"
                          : usernameStatus === "available"
                          ? "text-green-500"
                          : ""
                      }`}
                    >
                      {usernameStatus === "checking" && "Checking..."}
                      {usernameStatus === "taken" && "Taken"}
                      {usernameStatus === "available" && "Available"}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    isDarkMode
                      ? "bg-slate-700/50 text-white border-slate-600/50 placeholder-slate-400 focus:border-blue-500/50"
                      : "bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-500 focus:border-blue-500"
                  }`}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    isDarkMode
                      ? "bg-slate-700/50 text-white border-slate-600/50 placeholder-slate-400 focus:border-blue-500/50"
                      : "bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-500 focus:border-blue-500"
                  }`}
                  required
                />
                <div>
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
                  {password && (
                    <ul className="mt-1 ml-2 text-xs text-slate-400 space-y-0.5">
                      <li
                        className={
                          password.length >= 8
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        At least 8 characters
                      </li>
                      <li
                        className={
                          /[A-Z]/.test(password)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        One uppercase letter
                      </li>
                      <li
                        className={
                          /[a-z]/.test(password)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        One lowercase letter
                      </li>
                      <li
                        className={
                          /[0-9]/.test(password)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        One number
                      </li>
                      <li
                        className={
                          /[^A-Za-z0-9]/.test(password)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        One special character
                      </li>
                    </ul>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Retype Password"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    isDarkMode
                      ? "bg-slate-700/50 text-white border-slate-600/50 placeholder-slate-400 focus:border-blue-500/50"
                      : "bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-500 focus:border-blue-500"
                  }`}
                  required
                />
              </>
            ) : (
              <>
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
              </>
            )}
            {(localError || error) && (
              <div className="text-red-500 text-sm">{localError || error}</div>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setLocalError(null);
                setPassword("");
                setRetypePassword("");
              }}
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
