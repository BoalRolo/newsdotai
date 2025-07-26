// Environment configuration
export const config = {
  // API Configuration - Now using NestJS proxy server (no API key needed in frontend)
  baseUrl: import.meta.env.DEV
    ? "http://localhost:3001/api"
    : "https://newsdotai-backend.onrender.com/api", // Atualizado para Render

  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  },

  // App Configuration
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate required environment variables
export const validateConfig = () => {
  const requiredVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

// Check if API is configured (backend proxy is always available)
export const isApiConfigured = () => {
  return true; // Backend proxy handles API key
};

// Get base URL for different environments
export const getBaseUrl = () => {
  if (config.isProduction) {
    return "/newsdotai";
  }
  return "/";
};
