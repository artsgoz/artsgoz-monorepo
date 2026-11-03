import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesService } from './articles/articles.service';
import { AdminArticlesController } from './articles/admin-articles.controller';
import { PublicArticlesController } from './articles/public-articles.controller';
import { DashboardController } from './dashboard/dashboard.controller';
import { CategoriesController } from './categories/categories.controller';
import { CommentsController } from './comments/comments.controller';
import { MediaController } from './media/media.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    AdminArticlesController,
    PublicArticlesController,
    DashboardController,
    CategoriesController,
    CommentsController,
    MediaController,
    AuthController,
  ],
  providers: [AppService, ArticlesService],
})
export class AppModule {}
