import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserSettings } from "../../hooks/useUserSettings";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings, updateTheme } = useUserSettings();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sincronizar com as configurações do Firestore
  useEffect(() => {
    if (settings?.theme) {
      // Converter tema para boolean (dark = true, light = false)
      setIsDarkMode(settings.theme === "dark");
    }
  }, [settings?.theme]);

  // Aplicar tema ao DOM
  useEffect(() => {
    setTimeout(() => {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    }, 0);
  }, [isDarkMode]);

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Salvar no Firebase
    try {
      await updateTheme(newDarkMode ? "dark" : "light");
    } catch (error) {
      console.error("Failed to update theme in Firebase:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
