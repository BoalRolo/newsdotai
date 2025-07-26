import axios from "axios";
import type { NewsApiResponse, NewsSearchParams } from "../types/news";
import { config, isApiConfigured } from "../config/env";

// Instância do Axios com configuração base
const newsApi = axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratamento de erros
newsApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (error.response?.status === 401) {
      throw new Error("Invalid API key. Please check your configuration.");
    }
    if (error.response?.status === 422) {
      throw new Error("Invalid parameters. Please check your search criteria.");
    }
    throw new Error("Failed to fetch news. Please try again.");
  }
);

export const newsService = {
  /**
   * Busca notícias por palavra-chave
   */
  async searchNews(params: NewsSearchParams): Promise<NewsApiResponse> {
    try {
      const response = await newsApi.get("/news", {
        params: {
          ...params,
          // Garantir que só enviamos parâmetros válidos para NewsData.io
          ...(params.q && { q: params.q }),
          ...(params.language && { language: params.language }),
          ...(params.country && { country: params.country }),
          ...(params.category && { category: params.category }),
          ...(params.page && { page: params.page }),
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca notícias por múltiplas palavras-chave
   */
  async searchMultipleTopics(
    topics: Array<{ label: string; topic: string }>
  ): Promise<Array<{ label: string; topic: string; articles: any[] }>> {
    const promises = topics.map(async ({ label, topic }) => {
      try {
        const response = await this.searchNews({ q: label });

        const result = {
          label,
          topic,
          articles: response.results || [], // NewsData.io retorna 'results'
        };

        return result;
      } catch (error) {
        return {
          label,
          topic,
          articles: [],
        };
      }
    });

    const results = await Promise.all(promises);
    return results;
  },

  /**
   * Verifica se a API key está configurada
   */
  isApiKeyConfigured(): boolean {
    return isApiConfigured();
  },
};

export default newsService;
