import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class PublicArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getArticles(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category_slug') categorySlug?: string,
    @Query('tag_slug') tagSlug?: string,
    @Query('search') search?: string,
  ) {
    return this.articlesService.getPublicArticles({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      category_slug: categorySlug,
      tag_slug: tagSlug,
      search,
    });
  }

  @Get(':slug')
  getArticleBySlug(@Param('slug') slug: string) {
    return this.articlesService.getPublicArticleBySlug(slug);
  }

  @Post(':slug/view')
  incrementView(@Param('slug') slug: string) {
    return this.articlesService.incrementViewCount(slug);
  }

  @Get(':slug/comments')
  getComments(@Param('slug') slug: string) {
    return this.articlesService.getArticleComments(slug);
  }

  @Post(':slug/comments')
  addComment(
    @Param('slug') slug: string,
    @Body() body: { author_name: string; author_email?: string; content: string },
  ) {
    return this.articlesService.addArticleComment(slug, body);
  }
}

