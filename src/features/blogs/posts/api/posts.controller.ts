import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { CreatePostInputModel } from './models/posts.input.models';
import { CommentCreateInputModel } from '../../comments/api/models/comments.input.models';
import { CommentCreateDto } from '../../comments/types/input';
import { Request } from 'express';
import { CommentsService } from '../../comments/application/comments.service';
import { PostsLikesInputModel } from '../../likes/api/models/likes.input.models';
import { PostsLikesService } from '../../likes/application/posts.likes.service';
import { BlogsService } from '../../blogs/application/blogs.service';
import { UsersService } from '../../../users/application/users.service';
import { QueryUsersRequestType } from '../../../users/types/input';
import { createQuery } from '../../../common/create.query';
import { AccessToken } from '../../../../common/token.services/access-token.service';
import { AdminAuthGuard, AuthGuard } from '../../../../infrastructure/guards/admin-auth-guard.service';

@Controller('posts')
export class PostsController {
  constructor(
    protected readonly postsService: PostsService,
    protected readonly blogsService: BlogsService,
    protected readonly postsQueryRepository: PostsQueryRepository,
    protected readonly commentsService: CommentsService,
    protected readonly commentsQueryRepository: CommentsQueryRepository,
    protected readonly userService: UsersService,
    protected readonly postsLikesService: PostsLikesService,
    protected readonly accessToken: AccessToken,
  ) {}

  @Get()
  async getAllPosts(@Query() query: QueryUsersRequestType, @Req() req: Request) {
    const { sortData, searchData } = createQuery(query);
    try {
      const authHeader = req.header('authorization')?.split(' ');
      const accessTokenPayload = this.accessToken.decode(authHeader[1]);
      const userId = accessTokenPayload.userId;
      return await this.postsQueryRepository.getAllPosts(sortData, null, userId);
    } catch {
      return await this.postsQueryRepository.getAllPosts(sortData);
    }
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Req() req: Request) {
    try {
      const authHeader = req.header('authorization')?.split(' ');
      const accessTokenPayload = this.accessToken.decode(authHeader[1]);
      const userId = accessTokenPayload.userId;
      return await this.postsQueryRepository.getPostById(id, userId);
    } catch {
      return await this.postsQueryRepository.getPostById(id);
    }
  }

  @Get(':id/comments')
  async getAllPostComments(@Query() query: QueryUsersRequestType, @Param('id') id: string, @Req() req: Request) {
    const { sortData, searchData } = createQuery(query);
    try {
      const authHeader = req.header('authorization')?.split(' ');
      const accessTokenPayload = this.accessToken.decode(authHeader[1]);
      const userId = accessTokenPayload.userId;
      return await this.commentsQueryRepository.getAllCommentsByPostId(sortData, id, userId);
    } catch {
      return await this.commentsQueryRepository.getAllCommentsByPostId(sortData, id);
    }
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async createNewPost(@Body() inputModel: CreatePostInputModel) {
    const blog = await this.blogsService.getBlogById(inputModel.blogId);
    if (!blog) throw new BadRequestException();
    const newPostId = await this.postsService.createNewPost(inputModel);
    return await this.postsQueryRepository.getPostById(newPostId);
  }

  @Post(':postId/comments')
  @UseGuards(AuthGuard)
  async createNewCommentToPost(@Req() req: any, @Param('postId') postId: string, @Body() inputModel: CommentCreateInputModel) {
    const authHeader = req.header('authorization')?.split(' ');
    const accessTokenPayload = this.accessToken.decode(authHeader[1]);
    const userId = accessTokenPayload.userId;
    const user = await this.userService.getUserById(userId);

    const commentCreateDto: CommentCreateDto = {
      content: inputModel.content,
      postId: postId,
      userId: user.id,
      userLogin: user.login,
    };
    const commentId: string = await this.commentsService.createComment(commentCreateDto);
    return await this.commentsQueryRepository.getById(commentId);
  }

  @Put(':postID/like-status')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(@Param('postID') postID: string, @Body() inputModel: PostsLikesInputModel, @Req() req: any) {
    const isPostExist = await this.postsService.isPostExist(postID);
    if (!isPostExist) throw new NotFoundException();

    const authHeader = req.header('authorization')?.split(' ');
    const accessTokenPayload = this.accessToken.decode(authHeader[1]);
    const userId = accessTokenPayload.userId;
    await this.postsLikesService.updateLike(userId, postID, inputModel);

    return;
  }
}
