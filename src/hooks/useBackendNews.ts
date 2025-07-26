import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { config } from "../config/env";
import type { NewsArticle } from "../types/news";

export interface StoredNewsArticle extends NewsArticle {
  id?: string;
  topicId: string;
  topicLabel: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
  isFavorite?: boolean;
}

interface FilterOptions {
  topicId?: string;
  isFavorite?: boolean;
  fromDate?: string;
  toDate?: string;
  keywords?: string;
}

export function useBackendNews() {
  const { user } = useAuth();
  const [news, setNews] = useState<StoredNewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guardar notícias via backend
  const saveNews = useCallback(
    async (articles: NewsArticle[], topicId: string, topicLabel: string) => {
      if (!user) throw new Error("Not authenticated");

      try {
        const response = await fetch(`${config.baseUrl}/news/store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            articles,
            topicId,
            topicLabel,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to store news: ${response.statusText}`);
        }

        const savedArticles = await response.json();
        return savedArticles;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  // Buscar notícias guardadas via backend
  const fetchNews = useCallback(
    async (filters: FilterOptions = {}) => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, value.toString());
          }
        });

        const response = await fetch(
          `${config.baseUrl}/news/feed/${user.uid}?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.statusText}`);
        }

        const newsData = await response.json();
        setNews(newsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Marcar/desmarcar favorito via backend
  const toggleFavorite = useCallback(
    async (newsId: string, isFavorite: boolean) => {
      if (!user) throw new Error("Not authenticated");

      try {
        const response = await fetch(
          `${config.baseUrl}/news/favorite/${user.uid}/${newsId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isFavorite }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to update favorite: ${response.statusText}`);
        }

        // Atualizar estado local
        setNews((prev) =>
          prev.map((n) => (n.id === newsId ? { ...n, isFavorite } : n))
        );

        return await response.json();
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  // Apagar notícia via backend
  const deleteNews = useCallback(
    async (newsId: string) => {
      if (!user) throw new Error("Not authenticated");

      try {
        const response = await fetch(
          `${config.baseUrl}/news/${user.uid}/${newsId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete news: ${response.statusText}`);
        }

        // Remover do estado local
        setNews((prev) => prev.filter((n) => n.id !== newsId));

        return await response.json();
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  // Buscar estatísticas via backend
  const getStats = useCallback(async () => {
    if (!user) return null;

    try {
      const response = await fetch(`${config.baseUrl}/news/stats/${user.uid}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [user]);

  // Limpar notícias carregadas
  const clearNews = useCallback(() => setNews([]), []);

  return {
    news,
    loading,
    error,
    saveNews,
    fetchNews,
    clearNews,
    toggleFavorite,
    deleteNews,
    getStats,
  };
}
