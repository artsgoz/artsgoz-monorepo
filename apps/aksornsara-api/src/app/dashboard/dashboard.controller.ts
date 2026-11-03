import { Controller, Get, Query } from '@nestjs/common';
import { ArticlesService } from '../articles/articles.service';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('stats')
  getStats() {
    return this.articlesService.getDashboardStats();
  }

  @Get('monthly-trends')
  getMonthlyTrends(@Query('year') year?: string) {
    return this.articlesService.getMonthlyTrends(year ? Number(year) : undefined);
  }

  @Get('top-articles')
  getTopArticles(@Query('limit') limit?: string) {
    return this.articlesService.getTopArticles(limit ? Number(limit) : undefined);
  }

  @Get('top-categories')
  getTopCategories() {
    return this.articlesService.getTopCategories();
  }

  @Get('recent-activities')
  getRecentActivities() {
    return this.articlesService.getRecentActivities();
  }
}

