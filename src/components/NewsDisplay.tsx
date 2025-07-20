import type { TopicWithNews } from "../types/news";

interface NewsDisplayProps {
  topicsWithNews: TopicWithNews[];
  isDarkMode: boolean;
}

export default function NewsDisplay({
  topicsWithNews,
  isDarkMode,
}: NewsDisplayProps) {
  // Debug: Log dos dados recebidos
  console.log("📰 NewsDisplay - topicsWithNews:", topicsWithNews);

  if (topicsWithNews.length > 0 && topicsWithNews[0].articles.length > 0) {
    console.log("🔍 Sample article data:", topicsWithNews[0].articles[0]);

    // Log detalhado de cada artigo
    topicsWithNews[0].articles.forEach((article, index) => {
      console.log(`📄 Article ${index + 1}:`, {
        title: article.title,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source,
        description: article.description,
        content: article.content,
        image: article.image,
      });
    });
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date";

    const date = new Date(dateString);

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return "No date";
    }

    try {
      return date.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "No date";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      {topicsWithNews.map((topicData, index) => (
        <div
          key={`${topicData.label}-${index}`}
          className={`p-6 rounded-3xl transition-all duration-500 ${
            isDarkMode
              ? "bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/20"
              : "bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl shadow-slate-200/50"
          }`}
        >
          {/* Header do tópico */}
          <div className="flex items-center space-x-3 mb-6">
            <div
              className={`w-3 h-3 rounded-full ${
                isDarkMode ? "bg-blue-400" : "bg-blue-500"
              }`}
            ></div>
            <h3
              className={`text-xl font-bold transition-colors duration-500 ${
                isDarkMode ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {topicData.label}
            </h3>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "text-slate-300 bg-slate-600/50"
                  : "text-slate-600 bg-slate-200"
              }`}
            >
              {topicData.topic}
            </span>
            {topicData.isLoading && (
              <div
                className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                  isDarkMode ? "border-slate-400" : "border-slate-600"
                }`}
              ></div>
            )}
          </div>

          {/* Estado de loading */}
          {topicData.isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`animate-pulse ${
                    isDarkMode ? "bg-slate-700/50" : "bg-slate-200"
                  } rounded-2xl h-32`}
                ></div>
              ))}
            </div>
          )}

          {/* Estado de erro */}
          {topicData.error && (
            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode
                  ? "bg-red-900/20 border-red-700/50 text-red-300"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <p className="font-medium">Error: {topicData.error}</p>
            </div>
          )}

          {/* Lista de notícias */}
          {!topicData.isLoading &&
            !topicData.error &&
            topicData.articles.length > 0 && (
              <div className="space-y-4">
                {topicData.articles.slice(0, 5).map((article, articleIndex) => (
                  <article
                    key={articleIndex}
                    className={`p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                      isDarkMode
                        ? "bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700/70"
                        : "bg-slate-50 border border-slate-200 hover:bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex space-x-4">
                      {/* Imagem da notícia */}
                      {(article.image || article.image_url) &&
                        (article.image || article.image_url)?.trim() !== "" && (
                          <div className="flex-shrink-0">
                            <img
                              src={article.image || article.image_url || ""}
                              alt={article.title}
                              className="w-20 h-20 object-cover rounded-xl"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>
                        )}

                      {/* Conteúdo da notícia */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold mb-2 transition-colors duration-300 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {truncateText(article.title, 80)}
                        </h4>

                        <p
                          className={`text-sm mb-3 transition-colors duration-300 ${
                            isDarkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {truncateText(
                            article.description ||
                              article.content ||
                              "No description available",
                            120
                          )}
                        </p>

                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-medium transition-colors duration-300 ${
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {article.source?.name || "Unknown Source"}
                          </span>
                          <span
                            className={`text-xs transition-colors duration-300 ${
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Link para a notícia */}
                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-3 inline-flex items-center text-sm font-medium transition-colors duration-300 ${
                          isDarkMode
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-500"
                        }`}
                        onClick={(e) => {
                          console.log("🔗 Clicking link:", article.url);
                          if (!article.url || article.url.trim() === "") {
                            e.preventDefault();
                            console.warn("⚠️ Empty URL, preventing navigation");
                          }
                        }}
                      >
                        Ler mais
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}

          {/* Mensagem quando não há notícias */}
          {!topicData.isLoading &&
            !topicData.error &&
            topicData.articles.length === 0 && (
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode
                    ? "bg-slate-700/30 border-slate-600/50 text-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <p className="text-center">
                  Nenhuma notícia encontrada para "{topicData.label}"
                </p>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
