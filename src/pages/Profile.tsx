import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useTheme } from "../components/layout/ThemeContext";
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

  function validatePassword(password: string): string[] {
    const errors: string[] = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
    return errors;
  }

  const passwordErrors = validatePassword(newPassword);

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
            id="new-username"
            name="new-username"
            type="text"
            autoComplete="nope"
            className={
              isDarkMode
                ? "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                : "input-light mb-4"
            }
            placeholder="New username"
            value={newUsername}
            onChange={(e) =>
              setNewUsername(
                e.target.value.replace(/[^a-z0-9_]/g, "").toLowerCase()
              )
            }
            disabled={saving}
          />
          {newUsername && (
            <span className="text-xs ml-2">
              {usernameStatus === "checking" && "Checking..."}
              {usernameStatus === "taken" && (
                <span className="text-red-500">Taken</span>
              )}
              {usernameStatus === "available" && (
                <span className="text-green-500">Available</span>
              )}
            </span>
          )}
          <button
            className={
              isDarkMode ? "btn-primary mt-2" : "btn-primary-light mt-2"
            }
            onClick={handleSaveUsername}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {saveMsg && (
            <div className="text-xs mt-2 text-green-500">{saveMsg}</div>
          )}
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
            Current password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            className={
              isDarkMode
                ? "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                : "input-light mb-2"
            }
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={passwordSaving}
          />
          <label
            className={
              isDarkMode
                ? "block text-sm font-medium mb-2"
                : "block text-sm font-medium mb-2 text-slate-900"
            }
          >
            New password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            className={
              isDarkMode
                ? "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                : "input-light mb-2"
            }
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={passwordSaving}
          />
          {newPassword && (
            <ul className="mt-1 ml-2 text-xs text-slate-400 space-y-0.5">
              <li
                className={
                  newPassword.length >= 8 ? "text-green-500" : "text-red-500"
                }
              >
                At least 8 characters
              </li>
              <li
                className={
                  /[A-Z]/.test(newPassword) ? "text-green-500" : "text-red-500"
                }
              >
                One uppercase letter
              </li>
              <li
                className={
                  /[a-z]/.test(newPassword) ? "text-green-500" : "text-red-500"
                }
              >
                One lowercase letter
              </li>
              <li
                className={
                  /[0-9]/.test(newPassword) ? "text-green-500" : "text-red-500"
                }
              >
                One number
              </li>
              <li
                className={
                  /[^A-Za-z0-9]/.test(newPassword)
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                One special character
              </li>
            </ul>
          )}
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
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
