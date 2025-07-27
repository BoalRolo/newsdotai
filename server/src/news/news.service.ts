import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

// Inicializar Firebase Admin se ainda não estiver inicializado
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY is not set');
    }

    // Garantir que a chave privada está formatada corretamente
    const formattedPrivateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/"/g, '')
      .trim();

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedPrivateKey,
      }),
    });
    console.log('[Firebase] Firebase Admin initialized successfully');
  } catch (error) {
    console.error('[Firebase] Error initializing Firebase Admin:', error);
    throw error;
  }
}

const db = admin.firestore();

@Injectable()
export class NewsService {
  private readonly apiKey = process.env.NEWSDATA_API_KEY;
  private readonly baseUrl = 'https://newsdata.io/api/1/news';

  async fetchNews(query: any) {
    if (!this.apiKey) {
      throw new HttpException(
        'NewsData API key not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const params = {
        ...query,
        apikey: this.apiKey,
      };

      const response = await axios.get(this.baseUrl, { params });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `NewsData API error: ${error.response.data.message || error.response.statusText}`,
          error.response.status,
        );
      }
      throw new HttpException(
        'Failed to fetch news',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Guardar notícias para um utilizador
  async storeNewsForUser(
    userId: string,
    articles: any[],
    topicId: string,
    topicLabel: string,
  ) {
    try {
      const newsRef = db.collection('users').doc(userId).collection('news');
      const savedArticles: any[] = [];
      const articlesArray = Array.isArray(articles) ? articles : [articles];
      for (const article of articlesArray) {
        const docData = {
          ...article,
          topicId,
          topicLabel,
          userId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          isFavorite: false,
        };

        const docRef = await newsRef.add(docData);
        savedArticles.push({ id: docRef.id, ...docData });
      }

      return savedArticles;
    } catch (error) {
      console.error('Error storing news:', error);
      throw new HttpException(
        'Failed to store news',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar notícias guardadas de um utilizador
  async getStoredNews(userId: string, filters: any = {}) {
    try {
      let query: any = db.collection('users').doc(userId).collection('news');

      if (filters.topicId) {
        query = query.where('topicLabel', '==', filters.topicId);
      }
      if (filters.isFavorite !== undefined) {
        const isFavoriteBool =
          filters.isFavorite === 'true' || filters.isFavorite === true;
        query = query.where('isFavorite', '==', isFavoriteBool);
      }
      if (filters.fromDate) {
        query = query.where('publishedAt', '>=', filters.fromDate);
      }
      if (filters.toDate) {
        query = query.where('publishedAt', '<=', filters.toDate);
      }
      if (filters.keywords) {
        query = query.where('keywords', 'array-contains', filters.keywords);
      }

      query = query.orderBy('publishedAt', 'desc');

      const snapshot = await query.get();

      const news: any[] = [];
      const uniqueTopicIds = new Set<string>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        news.push({ id: doc.id, ...data });
        if (data.topicId) {
          uniqueTopicIds.add(data.topicId);
        }
      });

      return news;
    } catch (error) {
      console.error('[getStoredNews] Error:', error, 'filters:', filters);
      throw new HttpException(
        'Failed to fetch stored news',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Marcar/desmarcar favorito
  async toggleFavorite(userId: string, newsId: string, isFavorite: boolean) {
    try {
      console.log(
        '[toggleFavorite] userId:',
        userId,
        'newsId:',
        newsId,
        'isFavorite:',
        isFavorite,
      );
      const newsDoc = db
        .collection('users')
        .doc(userId)
        .collection('news')
        .doc(newsId);
      await newsDoc.update({
        isFavorite,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('[toggleFavorite] Successfully updated favorite status');
      return { success: true, isFavorite };
    } catch (error) {
      console.error('[toggleFavorite] Error:', error);
      throw new HttpException(
        'Failed to update favorite status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Apagar notícia
  async deleteNews(userId: string, newsId: string) {
    try {
      const newsDoc = db
        .collection('users')
        .doc(userId)
        .collection('news')
        .doc(newsId);
      await newsDoc.delete();

      return { success: true };
    } catch (error) {
      throw new HttpException(
        'Failed to delete news',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Buscar estatísticas das notícias guardadas
  async getNewsStats(userId: string) {
    try {
      const newsRef = db.collection('users').doc(userId).collection('news');
      const snapshot = await newsRef.get();

      const total = snapshot.size;
      const favorites = snapshot.docs.filter(
        (doc) => doc.data().isFavorite,
      ).length;

      // Agrupar por tópico
      const topics: any = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const topic = data.topicLabel;
        if (!topics[topic]) {
          topics[topic] = 0;
        }
        topics[topic]++;
      });

      return {
        total,
        favorites,
        topics,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch news statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
