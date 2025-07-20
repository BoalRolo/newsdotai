export interface NewsArticle {
  title: string;
  description?: string;
  content?: string;
  url?: string;
  link?: string; // API retorna 'link' em vez de 'url'
  image?: string | null;
  image_url?: string | null; // API retorna 'image_url'
  publishedAt: string;
  pubDate?: string; // API também retorna 'pubDate'
  source?: {
    name: string;
    url?: string;
  };
  source_name?: string; // API retorna 'source_name'
  source_id?: string; // API retorna 'source_id'
  source_url?: string; // API retorna 'source_url'
  source_icon?: string; // API retorna 'source_icon'
  article_id?: string; // API retorna 'article_id'
  category?: string[]; // API retorna 'category'
  country?: string[]; // API retorna 'country'
  language?: string; // API retorna 'language'
  keywords?: string[]; // API retorna 'keywords'
  creator?: string[]; // API retorna 'creator'
  duplicate?: boolean; // API retorna 'duplicate'
  video_url?: string | null; // API retorna 'video_url'
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
