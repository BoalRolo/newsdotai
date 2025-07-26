import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

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
}
