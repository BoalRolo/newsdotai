import { useState, useCallback } from "react";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  serverTimestamp,
  QueryConstraint,
} from "firebase/firestore";
import { useAuth } from "./useAuth";
import type { NewsArticle } from "../types/news";

export interface StoredNewsArticle extends NewsArticle {
  id?: string;
  topicId: string;
  topicLabel: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isFavorite?: boolean;
}

interface FilterOptions {
  category?: string;
  topicId?: string;
  fromDate?: string; // ISO string
  toDate?: string; // ISO string
  keywords?: string;
  language?: string;
  limit?: number;
  isFavorite?: boolean;
}

export function useStoredNews() {
  const { user } = useAuth();
  const [news, setNews] = useState<StoredNewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guardar uma notícia
  const saveNews = useCallback(
    async (article: NewsArticle, topicId: string, topicLabel: string) => {
      if (!user) throw new Error("Not authenticated");
      try {
        const newsRef = collection(db, "users", user.uid, "news");
        const docData: Omit<StoredNewsArticle, "id"> = {
          ...article,
          topicId,
          topicLabel,
          userId: user.uid,
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
          isFavorite: false,
        };
        await addDoc(newsRef, docData);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  // Marcar/desmarcar favorito
  const toggleFavorite = useCallback(
    async (newsId: string, value: boolean) => {
      if (!user) throw new Error("Not authenticated");
      const newsDoc = doc(db, "users", user.uid, "news", newsId);
      await updateDoc(newsDoc, {
        isFavorite: value,
        updatedAt: serverTimestamp(),
      });
      setNews((prev) =>
        prev.map((n) => (n.id === newsId ? { ...n, isFavorite: value } : n))
      );
    },
    [user]
  );

  // Apagar notícia
  const deleteNews = useCallback(
    async (newsId: string) => {
      if (!user) throw new Error("Not authenticated");
      const newsDoc = doc(db, "users", user.uid, "news", newsId);
      await deleteDoc(newsDoc);
      setNews((prev) => prev.filter((n) => n.id !== newsId));
    },
    [user]
  );

  // Buscar notícias com filtros
  const fetchNews = useCallback(
    async (filters: FilterOptions = {}) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const newsRef = collection(db, "users", user.uid, "news");
        const constraints: QueryConstraint[] = [];
        if (filters.category)
          constraints.push(
            where("category", "array-contains", filters.category)
          );
        if (filters.topicId)
          constraints.push(where("topicId", "==", filters.topicId));
        if (filters.language)
          constraints.push(where("language", "==", filters.language));
        if (filters.fromDate)
          constraints.push(where("publishedAt", ">=", filters.fromDate));
        if (filters.toDate)
          constraints.push(where("publishedAt", "<=", filters.toDate));
        if (filters.keywords)
          constraints.push(
            where("keywords", "array-contains", filters.keywords)
          );
        if (filters.isFavorite !== undefined)
          constraints.push(where("isFavorite", "==", filters.isFavorite));
        constraints.push(orderBy("publishedAt", "desc"));
        if (filters.limit) constraints.push(orderBy("createdAt", "desc"));
        const q = query(newsRef, ...constraints);
        const snap = await getDocs(q);
        const newsList: StoredNewsArticle[] = [];
        snap.forEach((doc) => {
          newsList.push({ id: doc.id, ...(doc.data() as StoredNewsArticle) });
        });
        setNews(newsList);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

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
  };
}
