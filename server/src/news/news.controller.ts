import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query() query: any) {
    return this.newsService.fetchNews(query);
  }
}
