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
      console.log(
        "🔄 useNews - fetchNews called with topics:",
        topics,
        "useMock:",
        useMock
      );

      // Se usar mock, não precisamos verificar a API key
      if (!useMock && !isApiConfigured()) {
        console.error("❌ API key not configured");
        setError(
          "API key not configured. Please check your environment variables."
        );
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("🚀 Starting news fetch for topics:", topics);

        let results;

        if (useMock) {
          console.log("🎭 Using mock data instead of API");
          // Usar dados mock
          results = topics.map(({ label, topic }) => {
            const mockArticles = getMockNewsForTopic(topic);
            console.log(
              `🎭 Mock data for ${topic}:`,
              mockArticles.length,
              "articles"
            );

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

        console.log("📊 useNews - Raw results:", results);

        // Log detalhado de cada resultado
        results.forEach((result, index) => {
          console.log(`📰 Result ${index + 1} for "${result.label}":`, {
            label: result.label,
            topic: result.topic,
            articlesCount: result.articles?.length || 0,
            firstArticle: result.articles?.[0]
              ? {
                  title: result.articles[0].title,
                  url: result.articles[0].url,
                  publishedAt: result.articles[0].publishedAt,
                  source: result.articles[0].source,
                  description: result.articles[0].description,
                  content: result.articles[0].content,
                }
              : null,
          });
        });

        // Processar e validar os dados
        const processedResults = results.map((result) => {
          console.log(
            `🔍 Processing articles for ${result.label}:`,
            result.articles
          );

          const validArticles = result.articles.map((article) => {
            console.log("📰 Processing article:", {
              title: article.title,
              url: article.url,
              publishedAt: article.publishedAt,
              source: article.source,
            });

            // Verificar se o artigo tem a estrutura correta
            if (!article || typeof article !== "object") {
              console.warn("⚠️ Invalid article structure:", article);
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

        console.log("✅ useNews - Processed results:", processedResults);
        setTopicsWithNews(processedResults);
      } catch (error) {
        console.error("❌ useNews - Error fetching news:", error);
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
    console.log("🧹 useNews: Clearing all news");
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
