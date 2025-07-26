// Environment configuration
export const config = {
  // API Configuration - Now using NestJS proxy server
  apiKey: import.meta.env.VITE_NEWS_API_KEY || "",
  baseUrl: import.meta.env.DEV
    ? "http://localhost:3001/api"
    : "https://your-nestjs-server.com/api", // Update this with your production server URL

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
    "VITE_NEWS_API_KEY",
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

// Check if API key is configured
export const isApiConfigured = () => {
  return !!config.apiKey && config.apiKey !== "";
};

// Get base URL for different environments
export const getBaseUrl = () => {
  if (config.isProduction) {
    return "/newsdotai";
  }
  return "/";
};
