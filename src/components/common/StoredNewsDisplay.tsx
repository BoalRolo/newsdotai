import { useState, useEffect } from "react";
import { useBackendNews } from "../../hooks/useBackendNews";
import { useUserTopics } from "../../hooks/useUserTopics";
import { useTheme } from "../../components/layout/ThemeContext";

interface FilterState {
  topicId: string;
  isFavorite: boolean | null;
  fromDate: string;
  toDate: string;
  keywords: string;
}

export default function StoredNewsDisplay() {
  const { news, loading, error, fetchNews, toggleFavorite, deleteNews } =
    useBackendNews();
  const { topics } = useUserTopics();
  const { isDarkMode } = useTheme();

  const [filters, setFilters] = useState<FilterState>({
    topicId: "",
    isFavorite: null,
    fromDate: "",
    toDate: "",
    keywords: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Carregar notícias quando o componente montar
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Aplicar filtros
  const applyFilters = () => {
    const filterOptions: any = {};

    if (filters.topicId) filterOptions.topicId = filters.topicId;
    if (filters.isFavorite !== null)
      filterOptions.isFavorite = filters.isFavorite;
    if (filters.fromDate) filterOptions.fromDate = filters.fromDate;
    if (filters.toDate) filterOptions.toDate = filters.toDate;
    if (filters.keywords) filterOptions.keywords = filters.keywords;

    fetchNews(filterOptions);
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      topicId: "",
      isFavorite: null,
      fromDate: "",
      toDate: "",
      keywords: "",
    });
    fetchNews();
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Truncar texto
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 py-12 transition-all duration-500 ${
        isDarkMode
          ? "bg-glass-gradient text-white"
          : "bg-glass-gradient-light text-slate-900"
      }`}
    >
      {/* Subtle background overlay (copiado do Home) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-900 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500 opacity-10 rounded-full blur-2xl" />
      </div>
      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Feed
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {news.length} notícias no teu feed
          </p>
        </div>

        {/* Filtros */}
        <div
          className={`mb-6 p-4 rounded-xl ${
            isDarkMode
              ? "bg-slate-800/30 border border-slate-700"
              : "bg-white/90 border border-slate-200 shadow"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Filtros
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDarkMode
                  ? "bg-slate-600/50 text-slate-300 hover:bg-slate-500/50"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              {showFilters ? "Ocultar" : "Mostrar"} Filtros
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tópico */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Tópico
                </label>
                <select
                  value={filters.topicId}
                  onChange={(e) =>
                    setFilters({ ...filters, topicId: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Todos os tópicos</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.label}>
                      {topic.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Favoritos */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Favoritos
                </label>
                <select
                  value={
                    filters.isFavorite === null
                      ? ""
                      : filters.isFavorite.toString()
                  }
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      isFavorite:
                        e.target.value === ""
                          ? null
                          : e.target.value === "true",
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Todos</option>
                  <option value="true">Apenas favoritos</option>
                  <option value="false">Não favoritos</option>
                </select>
              </div>

              {/* Data inicial */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Data inicial
                </label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) =>
                    setFilters({ ...filters, fromDate: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Data final */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Data final
                </label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters({ ...filters, toDate: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Palavras-chave */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Palavras-chave
                </label>
                <input
                  type="text"
                  value={filters.keywords}
                  onChange={(e) =>
                    setFilters({ ...filters, keywords: e.target.value })
                  }
                  placeholder="Ex: tecnologia, desporto..."
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={applyFilters}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                isDarkMode
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-blue-500 text-white hover:bg-blue-400"
              }`}
            >
              Aplicar Filtros
            </button>
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                isDarkMode
                  ? "bg-slate-600 text-white hover:bg-slate-500"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div
              className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                isDarkMode ? "border-white" : "border-gray-900"
              }`}
            ></div>
            <p
              className={`mt-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              A carregar notícias...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className={`text-center p-4 rounded-xl ${
              isDarkMode
                ? "bg-red-900/20 border border-red-700 text-red-300"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <p className="font-medium">Erro ao carregar notícias</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Lista de notícias */}
        {!loading && !error && news.length === 0 && (
          <div
            className={`text-center py-12 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p className="text-lg">Nenhuma notícia no feed</p>
            <p className="text-sm mt-2">
              Adiciona tópicos e busca notícias para começar a preencher o teu
              feed
            </p>
          </div>
        )}

        {/* Grid de notícias */}
        {!loading && !error && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <div
                key={article.id}
                className={`p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  isDarkMode
                    ? "bg-slate-800/30 border border-slate-700 text-white"
                    : "bg-white/90 border border-slate-200 text-gray-900 shadow"
                }`}
              >
                {/* Header da notícia */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        isDarkMode
                          ? "bg-blue-900/30 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {article.topicLabel}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {/* Botão favorito */}
                    <button
                      onClick={() =>
                        toggleFavorite(article.id!, !article.isFavorite)
                      }
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        article.isFavorite
                          ? "text-yellow-500"
                          : isDarkMode
                          ? "text-gray-400 hover:text-yellow-400"
                          : "text-gray-400 hover:text-yellow-500"
                      }`}
                    >
                      {article.isFavorite ? "★" : "☆"}
                    </button>
                    {/* Botão eliminar */}
                    <button
                      onClick={() => deleteNews(article.id!)}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        isDarkMode
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-500 hover:text-red-600"
                      }`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Título */}
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {article.title}
                </h3>

                {/* Descrição */}
                {article.description && (
                  <p
                    className={`text-sm mb-3 line-clamp-3 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {truncateText(article.description, 150)}
                  </p>
                )}

                {/* Imagem */}
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                {/* Fonte e data */}
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {article.source?.name || "Fonte desconhecida"}
                  </span>
                  <span
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formatDate(article.publishedAt)}
                  </span>
                </div>

                {/* Link */}
                <a
                  href={article.url || article.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block mt-3 text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                    isDarkMode
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-blue-500 text-white hover:bg-blue-400"
                  }`}
                >
                  Ler mais
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
