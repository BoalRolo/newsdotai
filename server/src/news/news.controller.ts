import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NewsService } from './news.service';

// Guard simples para autenticação (podes implementar um mais robusto depois)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query() query: any) {
    return this.newsService.fetchNews(query);
  }

  // Guardar notícias para um utilizador
  @Post('store')
  async storeNews(
    @Body()
    body: {
      userId: string;
      articles: any[];
      topicId: string;
      topicLabel: string;
    },
  ) {
    const { userId, articles, topicId, topicLabel } = body;
    return this.newsService.storeNewsForUser(
      userId,
      articles,
      topicId,
      topicLabel,
    );
  }

  // Buscar notícias guardadas de um utilizador
  @Get('feed/:userId')
  async getStoredNews(@Param('userId') userId: string, @Query() filters: any) {

    return this.newsService.getStoredNews(userId, filters);
  }

  // Marcar/desmarcar favorito
  @Patch('favorite/:userId/:newsId')
  async toggleFavorite(
    @Param('userId') userId: string,
    @Param('newsId') newsId: string,
    @Body() body: { isFavorite: boolean },
  ) {
    return this.newsService.toggleFavorite(userId, newsId, body.isFavorite);
  }

  // Apagar notícia
  @Delete(':userId/:newsId')
  async deleteNews(
    @Param('userId') userId: string,
    @Param('newsId') newsId: string,
  ) {
    return this.newsService.deleteNews(userId, newsId);
  }

  // Buscar estatísticas das notícias guardadas
  @Get('stats/:userId')
  async getNewsStats(@Param('userId') userId: string) {
    return this.newsService.getNewsStats(userId);
  }
}
