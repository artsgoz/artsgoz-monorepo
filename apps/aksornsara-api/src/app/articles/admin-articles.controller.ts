import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('admin/articles')
export class AdminArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getArticles(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('category_id') categoryId?: string,
    @Query('search') search?: string,
    @Query('sort_by') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.articlesService.getAdminArticles({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status,
      category_id: categoryId,
      search,
      sort_by: sortBy,
      order,
    });
  }

  @Post()
  createArticle(@Body() body: any) {
    return this.articlesService.createArticle(body);
  }

  @Get(':id')
  getArticle(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }

  @Put(':id')
  updateArticle(@Param('id') id: string, @Body() body: any) {
    return this.articlesService.updateArticle(id, body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'published' | 'draft' | 'archived',
  ) {
    return this.articlesService.updateArticleStatus(id, status);
  }

  @Delete(':id')
  deleteArticle(@Param('id') id: string) {
    return this.articlesService.deleteArticle(id);
  }

  @Get(':id/logs')
  getLogs(@Param('id') id: string) {
    return this.articlesService.getArticleLogs(id);
  }
}

