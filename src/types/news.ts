export interface NewsArticle {
  title: string;
  description?: string;
  content?: string;
  url: string;
  image?: string | null;
  publishedAt: string;
  source?: {
    name: string;
    url?: string;
  };
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage?: string;
}

export interface NewsSearchParams {
  q: string;
  language?: string;
  country?: string;
  category?: string;
  page?: number;
}

export interface TopicWithNews {
  topic: string;
  label: string;
  articles: NewsArticle[];
  isLoading?: boolean;
  error?: string;
}
