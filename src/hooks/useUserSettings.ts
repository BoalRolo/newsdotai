import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "./useAuth";

export interface UserSettings {
  theme: "dark" | "light";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UseUserSettingsReturn {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  updateTheme: (theme: "dark" | "light") => Promise<void>;
  clearError: () => void;
}

const defaultSettings: UserSettings = {
  theme: "dark",
};

export const useUserSettings = (): UseUserSettingsReturn => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar configurações do usuário em tempo real
  useEffect(() => {
    if (!user?.uid) {
      setSettings(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const settingsRef = doc(db, "users", user.uid, "settings", "preferences");

    const unsubscribe = onSnapshot(
      settingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setSettings({
            theme: data.theme || defaultSettings.theme,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          });
        } else {
          // Criar configurações padrão se não existirem
          setDoc(settingsRef, {
            ...defaultSettings,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setSettings(defaultSettings);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching user settings:", err);
        setError("Failed to load user settings");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Atualizar tema
  const updateTheme = async (theme: "dark" | "light"): Promise<void> => {
    if (!user?.uid) {
      setError("User not authenticated");
      return;
    }

    try {
      setError(null);
      const settingsRef = doc(db, "users", user.uid, "settings", "preferences");

      // Verificar se o documento existe primeiro
      const docSnap = await getDoc(settingsRef);
      if (docSnap.exists()) {
        await updateDoc(settingsRef, {
          theme,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(settingsRef, {
          theme,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error updating theme:", err);
      setError("Failed to update theme");
      throw err;
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  return {
    settings,
    loading,
    error,
    updateTheme,
    clearError,
  };
};
