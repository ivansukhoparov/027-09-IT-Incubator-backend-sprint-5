import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
  Post,
  Req,
  Body,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { Request } from 'express';
import { CommentsService } from '../application/comments.service';
import { CommentsLikesService } from '../../likes/application/comments.likes.service';
import { CommentsLikesInputModel } from '../../likes/api/models/likes.input.models';
import { UpdateCommentInputModel } from './models/comments.input.models';
import { CommentDocument } from '../infrastructure/comments.schema';
import { UsersService } from '../../../users/application/users.service';
import { AccessToken } from '../../../../common/token.services/access-token.service';
import { AuthGuard } from '../../../../infrastructure/guards/admin-auth-guard.service';

@Controller('comments')
export class CommentsController {
  constructor(
    protected readonly commentsQueryRepository: CommentsQueryRepository,
    protected readonly commentsLikesService: CommentsLikesService,
    protected readonly usersService: UsersService,
    protected readonly commentsService: CommentsService,
    protected readonly accessToken: AccessToken,
  ) {}

  @Get(':id')
  //@UseGuards(SoftAuthGuard)
  async getById(@Param('id') id: string, @Req() req: any) {
    try {
      const authHeader = req.header('authorization')?.split(' ');
      const accessTokenPayload = this.accessToken.decode(authHeader[1]);
      const userId = accessTokenPayload.userId;
      return await this.commentsQueryRepository.getById(id, userId);
    } catch {
      return await this.commentsQueryRepository.getById(id);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(@Param('id') id: string, @Body() inputModel: UpdateCommentInputModel, @Req() req: Request) {
    const authHeader = req.header('authorization')?.split(' ');
    const accessTokenPayload = this.accessToken.decode(authHeader[1]);
    const userId = accessTokenPayload.userId;
    const comment: CommentDocument = await this.commentsService.getCommentById(id);
    if (userId != comment.commentatorInfo.userId) {
      throw new ForbiddenException();
    }
    await this.commentsService.updateComment(id, inputModel);
    return;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param('id') id: string, @Req() req: Request) {
    const authHeader = req.header('authorization')?.split(' ');
    const accessTokenPayload = this.accessToken.decode(authHeader[1]);
    const userId = accessTokenPayload.userId;
    const comment: CommentDocument = await this.commentsService.getCommentById(id);

    if (userId != comment.commentatorInfo.userId) {
      throw new ForbiddenException();
    }
    await this.commentsService.deleteComment(id);
    return;
  }

  @Put(':commentId/like-status')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(@Param('commentId') commentId: string, @Body() inputModel: CommentsLikesInputModel, @Req() req: any) {
    const isCommentExist = await this.commentsService.isCommentExist(commentId);
    if (!isCommentExist) throw new NotFoundException();
    const authHeader = req.header('authorization')?.split(' ');
    const accessTokenPayload = this.accessToken.decode(authHeader[1]);
    const userId = accessTokenPayload.userId;
    await this.commentsLikesService.updateLike(userId, commentId, inputModel);

    return;
  }
}
