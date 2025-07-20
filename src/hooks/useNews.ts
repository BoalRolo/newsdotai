import { useState, useCallback } from "react";
import type { TopicWithNews, NewsArticle } from "../types/news";
import { newsService } from "../services/newsApi";
import { isApiConfigured } from "../config/env";

interface UseNewsReturn {
  topicsWithNews: TopicWithNews[];
  isLoading: boolean;
  error: string | null;
  fetchNews: (topics: Array<{ label: string; topic: string }>) => Promise<void>;
  clearNews: () => void;
  isApiKeyConfigured: boolean;
}

export const useNews = (): UseNewsReturn => {
  const [topicsWithNews, setTopicsWithNews] = useState<TopicWithNews[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(
    async (topics: Array<{ label: string; topic: string }>) => {
      console.log("🎯 useNews: Starting fetchNews with topics:", topics);

      if (!isApiConfigured()) {
        const errorMsg =
          "API key not configured. Please add VITE_NEWSDATA_API_KEY to your environment variables.";
        console.error("❌ useNews:", errorMsg);
        setError(errorMsg);
        return;
      }

      console.log("✅ useNews: API is configured, starting search...");
      setIsLoading(true);
      setError(null);

      try {
        // Inicializar estado de loading para cada tópico
        const initialTopics: TopicWithNews[] = topics.map(
          ({ label, topic }) => ({
            label,
            topic,
            articles: [],
            isLoading: true,
          })
        );

        console.log(
          "🔄 useNews: Setting initial loading state:",
          initialTopics
        );
        setTopicsWithNews(initialTopics);

        // Buscar notícias para todos os tópicos
        console.log("🚀 useNews: Calling newsService.searchMultipleTopics...");
        const results = await newsService.searchMultipleTopics(topics);

        console.log("📦 useNews: Raw results from API:", results);

        // Atualizar estado com os resultados
        const updatedTopics: TopicWithNews[] = results.map(
          ({ label, topic, articles }) => ({
            label,
            topic,
            articles: articles as NewsArticle[],
            isLoading: false,
          })
        );

        console.log("✅ useNews: Final updated topics:", updatedTopics);
        setTopicsWithNews(updatedTopics);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch news";
        console.error("❌ useNews: Error occurred:", errorMessage, err);
        setError(errorMessage);

        // Marcar todos os tópicos como com erro
        setTopicsWithNews((prev) =>
          prev.map((topic) => ({
            ...topic,
            isLoading: false,
            error: errorMessage,
          }))
        );
      } finally {
        console.log("🏁 useNews: Search completed, setting loading to false");
        setIsLoading(false);
      }
    },
    []
  );

  const clearNews = useCallback(() => {
    console.log("🧹 useNews: Clearing all news");
    setTopicsWithNews([]);
    setError(null);
  }, []);

  return {
    topicsWithNews,
    isLoading,
    error,
    fetchNews,
    clearNews,
    isApiKeyConfigured: isApiConfigured(),
  };
};
