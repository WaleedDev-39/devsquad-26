import { Controller, Get, Post, Body, Param, UseGuards, Req, Query, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    return this.commentsService.create(createCommentDto, req.user._id);
  }

  @Get(':postId')
  findByPostId(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(postId);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  likeComment(@Param('id') id: string, @Req() req) {
    return this.commentsService.likeComment(id, req.user._id);
  }
}
