// Configuração centralizada das variáveis de ambiente
export const env = {
  // API Configuration
  NEWS_API_KEY: import.meta.env.VITE_NEWSDATA_API_KEY || "",
  NEWS_API_BASE_URL:
    import.meta.env.VITE_NEWSDATA_API_BASE_URL ||
    "https://newsdata.io/api/1/news",

  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// Log das variáveis de ambiente (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log("🔧 Environment Configuration:", {
    hasApiKey: !!env.NEWS_API_KEY,
    apiKeyLength: env.NEWS_API_KEY.length,
    apiBaseUrl: env.NEWS_API_BASE_URL,
    nodeEnv: env.NODE_ENV,
  });
}

// Validação das variáveis obrigatórias
export const validateEnv = () => {
  const requiredVars = ["VITE_NEWSDATA_API_KEY"] as const;
  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn("Missing required environment variables:", missingVars);
    return false;
  }

  return true;
};

// Helper para verificar se a API está configurada
export const isApiConfigured = () => {
  const configured = !!env.NEWS_API_KEY;
  console.log("🔑 API Configuration check:", {
    configured,
    keyLength: env.NEWS_API_KEY.length,
    keyPreview: env.NEWS_API_KEY
      ? `${env.NEWS_API_KEY.substring(0, 8)}...`
      : "none",
  });
  return configured;
};
