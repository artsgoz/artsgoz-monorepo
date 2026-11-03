import { Controller, Get, Patch, Delete, Param, Query, Body } from '@nestjs/common';
import { ArticlesService } from '../articles/articles.service';

@Controller('admin/comments')
export class CommentsController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getComments(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.articlesService.getComments(
      status,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Patch(':id')
  updateCommentStatus(
    @Param('id') id: string,
    @Body('status') status: 'approved' | 'rejected' | 'spam',
  ) {
    return this.articlesService.updateCommentStatus(id, status);
  }

  @Delete(':id')
  deleteComment(@Param('id') id: string) {
    return this.articlesService.deleteComment(id);
  }
}

