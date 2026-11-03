import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ArticlesService } from '../articles/articles.service';

@Controller()
export class CategoriesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Public Categories for Navigation
  @Get('categories')
  getPublicCategories() {
    return this.articlesService.getCategories();
  }

  // Admin Categories
  @Get('admin/categories')
  getAdminCategories() {
    return this.articlesService.getCategories();
  }

  @Post('admin/categories')
  createCategory(@Body() body: { name: string; slug: string; description?: string }) {
    return this.articlesService.createCategory(body);
  }

  @Put('admin/categories/:id')
  updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.articlesService.updateCategory(id, body);
  }

  @Delete('admin/categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.articlesService.deleteCategory(id);
  }

  // Tags
  @Get('admin/tags')
  getTags(@Query('search') search?: string) {
    return this.articlesService.getTags(search);
  }

  @Post('admin/tags')
  createTag(@Body() body: { name: string; slug: string }) {
    return this.articlesService.createTag(body);
  }
}

