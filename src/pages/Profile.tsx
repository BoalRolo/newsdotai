import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../components/layout/ThemeContext";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import "../styles/ui.css";

export const ProfilePage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    null | "checking" | "taken" | "available"
  >(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Buscar username do Firestore ao montar
  React.useEffect(() => {
    if (user) {
      const fetchUsername = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username || "");
          // Não atualize setNewUsername aqui!
        }
      };
      fetchUsername();
    }
  }, [user]);

  // Check username availability when newUsername changes
  React.useEffect(() => {
    if (!newUsername) {
      setUsernameStatus(null);
      return;
    }
    let active = true;
    setUsernameStatus("checking");
    const check = setTimeout(async () => {
      const ref = doc(db, "usernames", newUsername.toLowerCase());
      const snap = await getDoc(ref);
      if (!active) return;
      setUsernameStatus(snap.exists() ? "taken" : "available");
    }, 500);
    return () => {
      active = false;
      clearTimeout(check);
    };
  }, [newUsername]);

  // Ensure newUsername is empty when user changes
  React.useEffect(() => {
    setNewUsername("");
  }, [user]);

  // Função para salvar novo username
  const handleSaveUsername = async () => {
    if (!user || !newUsername.trim()) return;
    if (usernameStatus === "taken") {
      setSaveMsg("Username already taken.");
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      // Remove old username from 'usernames' collection
      if (username) {
        await deleteDoc(doc(db, "usernames", username.toLowerCase()));
      }
      // Add new username to 'usernames' collection
      await setDoc(doc(db, "usernames", newUsername.toLowerCase()), {
        uid: user.uid,
        email: user.email,
      });
      // Update user's document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { username: newUsername.trim() });
      // Update Firebase Auth displayName
      await updateProfile(user, { displayName: newUsername.trim() });
      setUsername(newUsername.trim());
      setNewUsername("");
      setSaveMsg("Username updated!");
    } catch (err) {
      setSaveMsg("Error updating username");
    } finally {
      setSaving(false);
    }
  };

  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  const passwordErrors = validatePassword(newPassword);

  // Placeholder avatar (could be replaced with user photoURL)
  const avatarUrl =
    user?.photoURL ||
    "https://ui-avatars.com/api/?name=" +
      (username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U");

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
        } w-full max-w-md md:max-w-xl lg:max-w-2xl`}
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
        <section className="mb-8">
          <h3
            className={
              isDarkMode
                ? "text-lg font-bold mb-4"
                : "text-lg font-bold mb-4 text-slate-900"
            }
          >
            Username Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className={
                  isDarkMode
                    ? "block text-sm font-medium mb-2"
                    : "block text-sm font-medium mb-2 text-slate-700"
                }
              >
                Current Username
              </label>
              <input
                type="text"
                value={username}
                disabled
                className={
                  isDarkMode
                    ? "w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-slate-300 cursor-not-allowed"
                    : "w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed"
                }
              />
            </div>
            <div>
              <label
                className={
                  isDarkMode
                    ? "block text-sm font-medium mb-2"
                    : "block text-sm font-medium mb-2 text-slate-700"
                }
              >
                New Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className={
                  isDarkMode
                    ? "w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                placeholder="Enter new username"
              />
              {usernameStatus === "checking" && (
                <p className="text-blue-500 text-sm mt-1">
                  Checking availability...
                </p>
              )}
              {usernameStatus === "available" && (
                <p className="text-green-500 text-sm mt-1">
                  Username available!
                </p>
              )}
              {usernameStatus === "taken" && (
                <p className="text-red-500 text-sm mt-1">
                  Username already taken
                </p>
              )}
            </div>
            <button
              onClick={handleSaveUsername}
              disabled={!newUsername || usernameStatus === "taken" || saving}
              className={isDarkMode ? "btn-primary" : "btn-primary-light"}
            >
              {saving ? "Saving..." : "Update Username"}
            </button>
            {saveMsg && (
              <div className="text-xs mt-2 text-green-500">{saveMsg}</div>
            )}
          </div>
        </section>

        {/* Password Card */}
        <section>
          <h3
            className={
              isDarkMode
                ? "text-lg font-bold mb-4"
                : "text-lg font-bold mb-4 text-slate-900"
            }
          >
            Password Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className={
                  isDarkMode
                    ? "block text-sm font-medium mb-2"
                    : "block text-sm font-medium mb-2 text-slate-700"
                }
              >
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={
                  isDarkMode
                    ? "w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label
                className={
                  isDarkMode
                    ? "block text-sm font-medium mb-2"
                    : "block text-sm font-medium mb-2 text-slate-700"
                }
              >
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={
                  isDarkMode
                    ? "w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                placeholder="Enter new password"
              />
              {passwordErrors.length > 0 && (
                <div className="mt-2">
                  {passwordErrors.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm">
                      • {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <button
              className={
                isDarkMode ? "btn-primary mt-2" : "btn-primary-light mt-2"
              }
              onClick={async () => {
                setPasswordMsg("");
                setPasswordSaving(true);
                try {
                  if (!user) throw new Error("User not found");
                  if (passwordErrors.length > 0) {
                    setPasswordMsg("Password does not meet requirements.");
                    setPasswordSaving(false);
                    return;
                  }
                  const credential = EmailAuthProvider.credential(
                    user.email!,
                    currentPassword
                  );
                  await reauthenticateWithCredential(user, credential);
                  await updatePassword(user, newPassword);
                  setPasswordMsg("Password updated!");
                  setCurrentPassword("");
                  setNewPassword("");
                } catch (err: any) {
                  if (err.code === "auth/wrong-password") {
                    setPasswordMsg("Current password is incorrect.");
                  } else if (err.code === "auth/weak-password") {
                    setPasswordMsg("Password should be at least 6 characters.");
                  } else {
                    setPasswordMsg("Error updating password: " + err.message);
                  }
                } finally {
                  setPasswordSaving(false);
                }
              }}
              disabled={
                passwordSaving ||
                !currentPassword ||
                !newPassword ||
                passwordErrors.length > 0
              }
            >
              {passwordSaving ? "Saving..." : "Change Password"}
            </button>
            {passwordMsg && (
              <div className="text-xs mt-2 text-green-500">{passwordMsg}</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
