import { useState, useCallback, useMemo } from "react";
import type { TopicWithNews } from "../types/news";
import { newsService } from "../services/newsApi";
import { isApiConfigured } from "../config/env";
import { getMockNewsForTopic } from "../data/mockNews";

interface UseNewsReturn {
  topicsWithNews: TopicWithNews[];
  isLoading: boolean;
  error: string | null;
  fetchNews: (
    topics: Array<{ label: string; topic: string }>,
    useMock?: boolean
  ) => Promise<void>;
  clearNews: () => void;
  isApiKeyConfigured: boolean;
}

export const useNews = (): UseNewsReturn => {
  const [topicsWithNews, setTopicsWithNews] = useState<TopicWithNews[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(
    async (
      topics: Array<{ label: string; topic: string }>,
      useMock = false
    ) => {
      // Se usar mock, não precisamos verificar a API key
      if (!useMock && !isApiConfigured()) {
        setError(
          "API key not configured. Please check your environment variables."
        );
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let results;

        if (useMock) {
          // Usar dados mock
          results = topics.map(({ label, topic }) => {
            const mockArticles = getMockNewsForTopic(topic);
            return {
              label,
              topic,
              articles: mockArticles,
            };
          });
        } else {
          // Usar API real
          results = await newsService.searchMultipleTopics(topics);
        }

        // Processar e validar os dados
        const processedResults = results.map((result) => {
          const validArticles = result.articles.map((article) => {
            // Verificar se o artigo tem a estrutura correta
            if (!article || typeof article !== "object") {
              return {
                title: "Invalid article",
                url: "#",
                publishedAt: new Date().toISOString(),
                source: { name: "Unknown Source" },
                description: "Invalid article data",
              };
            }

            return {
              ...article,
              // Mapear campos corretamente baseado na estrutura da API
              title: article.title || "No title",
              url: article.link || article.url || "#", // Usar 'link' da API
              publishedAt:
                article.publishedAt ||
                article.pubDate ||
                new Date().toISOString(),
              source: {
                name:
                  article.source_name ||
                  article.source?.name ||
                  "Unknown Source",
                url: article.source_url || article.source?.url,
              },
              description:
                article.description ||
                article.content ||
                "No description available",
              image: article.image_url || article.image, // Usar 'image_url' da API
            };
          });

          return {
            ...result,
            articles: validArticles,
          };
        });

        setTopicsWithNews(processedResults);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch news"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearNews = useCallback(() => {
    setTopicsWithNews([]);
    setError(null);
  }, []);

  const isApiKeyConfigured = useMemo(() => {
    return isApiConfigured();
  }, []);

  return {
    topicsWithNews,
    isLoading,
    error,
    fetchNews,
    clearNews,
    isApiKeyConfigured,
  };
};
