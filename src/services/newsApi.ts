import axios from "axios";
import type { NewsApiResponse, NewsSearchParams } from "../types/news";
import { env, isApiConfigured } from "../config/env";

// Instância do Axios com configuração base
const newsApi = axios.create({
  baseURL: env.NEWS_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar a API key automaticamente
newsApi.interceptors.request.use((config) => {
  console.log("🌐 API Request:", {
    url: config.url,
    method: config.method,
    params: config.params,
    baseURL: config.baseURL,
    hasApiKey: !!env.NEWS_API_KEY,
    apiKeyLength: env.NEWS_API_KEY ? env.NEWS_API_KEY.length : 0,
  });

  if (env.NEWS_API_KEY) {
    config.params = {
      ...config.params,
      apikey: env.NEWS_API_KEY,
    };
    console.log("🔑 API Key added to request");
  } else {
    console.warn("⚠️ No API key found!");
  }
  return config;
});

// Interceptor para tratamento de erros
newsApi.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      status: response.status,
      data: response.data,
      totalResults: response.data?.totalResults,
      resultsCount: response.data?.results?.length,
    });

    // Log detalhado da resposta completa
    console.log(
      "🔍 FULL API RESPONSE:",
      JSON.stringify(response.data, null, 2)
    );

    return response;
  },
  (error) => {
    console.error("❌ News API Error:", {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (error.response?.status === 401) {
      throw new Error("Invalid API key. Please check your configuration.");
    }
    throw new Error("Failed to fetch news. Please try again.");
  }
);

export const newsService = {
  /**
   * Busca notícias por palavra-chave
   */
  async searchNews(params: NewsSearchParams): Promise<NewsApiResponse> {
    console.log("🔍 Searching news with params:", params);

    try {
      const response = await newsApi.get("", {
        params: {
          q: params.q,
          // Removendo parâmetros que podem estar causando problemas
          // language: params.language || 'pt',
          // country: params.country || 'pt',
          // category: params.category,
          // page: params.page || 1,
        },
      });

      console.log("📰 Search results for", params.q, ":", {
        totalResults: response.data.totalResults,
        articlesCount: response.data.results?.length || 0,
        status: response.data.status,
      });

      // Debug: Log da estrutura dos dados
      if (response.data.results && response.data.results.length > 0) {
        console.log("🔍 Sample article structure:", {
          title: response.data.results[0].title,
          url: response.data.results[0].url,
          publishedAt: response.data.results[0].publishedAt,
          source: response.data.results[0].source,
          description: response.data.results[0].description,
          content: response.data.results[0].content,
        });
      }

      return response.data;
    } catch (error) {
      console.error("❌ Error searching news for", params.q, ":", error);
      throw error;
    }
  },

  /**
   * Busca notícias por múltiplas palavras-chave
   */
  async searchMultipleTopics(
    topics: Array<{ label: string; topic: string }>
  ): Promise<Array<{ label: string; topic: string; articles: any[] }>> {
    console.log("🚀 Starting search for multiple topics:", topics);

    const promises = topics.map(async ({ label, topic }) => {
      try {
        console.log(`🔍 Searching for topic: ${label} (${topic})`);
        const response = await this.searchNews({ q: label });

        const result = {
          label,
          topic,
          articles: response.results || [],
        };

        console.log(`✅ Found ${result.articles.length} articles for ${label}`);
        return result;
      } catch (error) {
        console.error(`❌ Error fetching news for ${label}:`, error);
        return {
          label,
          topic,
          articles: [],
        };
      }
    });

    const results = await Promise.all(promises);
    console.log(
      "📊 Final results:",
      results.map((r) => ({ label: r.label, count: r.articles.length }))
    );

    return results;
  },

  /**
   * Verifica se a API key está configurada
   */
  isApiKeyConfigured(): boolean {
    const configured = isApiConfigured();
    console.log("🔑 API Key configured:", configured);
    return configured;
  },
};

export default newsService;
