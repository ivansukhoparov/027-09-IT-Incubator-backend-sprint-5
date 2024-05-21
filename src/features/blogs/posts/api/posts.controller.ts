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
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import {
  CreatePostInputModel,
  UpdatePostInputModel,
} from './models/posts.input.models';
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
import { AccessTokenService } from '../../../../common/token.services/access.token.service';
import { tokenServiceCommands } from '../../../../common/token.services/utils/common';
import {
  AdminAuthGuard,
  AuthGuard,
} from '../../../../infrastructure/guards/admin-auth-guard.service';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected blogsService: BlogsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected userService: UsersService,
    protected postsLikesService: PostsLikesService,
  ) {}

  @Get()
  async getAllPosts(
    @Query() query: QueryUsersRequestType,
    @Req() req: Request,
  ) {
    const { sortData, searchData } = createQuery(query);
    try {
      const authHeader = req.header('authorization')?.split(' ');
      const token = new AccessTokenService(
        tokenServiceCommands.set,
        authHeader[1],
      );
      const userId = token.decode().userId;
      return await this.postsQueryRepository.getAllPosts(
        sortData,
        null,
        userId,
      );
    } catch {
      return await this.postsQueryRepository.getAllPosts(sortData);
    }
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Req() req: Request) {
    try {
      const authHeader = req.header('authorization')?.split(' ');
      const token = new AccessTokenService(
        tokenServiceCommands.set,
        authHeader[1],
      );
      const userId = token.decode().userId;
      return await this.postsQueryRepository.getPostById(id, userId);
    } catch {
      return await this.postsQueryRepository.getPostById(id);
    }
  }

  @Get(':id/comments')
  async getAllPostComments(
    @Query() query: QueryUsersRequestType,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const { sortData, searchData } = createQuery(query);
    try {
      const authHeader = req.header('authorization')?.split(' ');
      const token = new AccessTokenService(
        tokenServiceCommands.set,
        authHeader[1],
      );
      const userId = token.decode().userId;
      return await this.commentsQueryRepository.getAllCommentsByPostId(
        sortData,
        id,
        userId,
      );
    } catch {
      return await this.commentsQueryRepository.getAllCommentsByPostId(
        sortData,
        id,
      );
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

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  async createNewCommentToPost(
    @Req() req: any,
    @Param('id') id: string,
    @Body() inputModel: CommentCreateInputModel,
  ) {
    const authHeader = req.header('authorization')?.split(' ');
    const token = new AccessTokenService(
      tokenServiceCommands.set,
      authHeader[1],
    );
    const userId = token.decode().userId;
    const user = await this.userService.getUserById(userId);

    const commentCreateDto: CommentCreateDto = {
      content: inputModel.content,
      postId: id,
      userId: user.id,
      userLogin: user.login,
    };
    const commentId: string =
      await this.commentsService.createComment(commentCreateDto);
    return await this.commentsQueryRepository.getById(commentId);
  }

  @Put(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateById(
    @Param('id') id: string,
    @Body() inputModel: UpdatePostInputModel,
  ) {
    await this.postsService.updatePost(id, inputModel);
    return {};
  }

  @Put(':id/like-status')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Param('id') id: string,
    @Body() inputModel: PostsLikesInputModel,
    @Req() req: any,
  ) {
    const authHeader = req.header('authorization')?.split(' ');
    const token = new AccessTokenService(
      tokenServiceCommands.set,
      authHeader[1],
    );
    const userId = token.decode().userId;
    await this.postsLikesService.updateLike(userId, id, inputModel);

    return;
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string) {
    await this.postsService.deletePost(id);
    return;
  }
}
