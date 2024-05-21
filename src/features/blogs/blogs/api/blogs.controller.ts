import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import {
  CreateBlogInputModel,
  UpdateBlogInputModel,
} from './models/blogs.input.models';
import { Request } from 'express';
import {
  CreatePostInputModel,
  CreatePostInputModelByBlog,
} from '../../posts/api/models/posts.input.models';
import { QueryUsersRequestType } from '../../../users/types/input';
import { createQuery } from '../../../common/create.query';
import { AccessTokenService } from '../../../../common/token.services/access.token.service';
import { tokenServiceCommands } from '../../../../common/token.services/utils/common';
import { AdminAuthGuard } from '../../../../infrastructure/guards/admin-auth-guard.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAll(@Query() query: QueryUsersRequestType) {
    const { sortData, searchData } = createQuery(query);
    return await this.blogsQueryRepository.getAllBlogs(sortData, searchData);
  }

  @Get(':id')
  async getById(@Param('id') userId: string) {
    return await this.blogsQueryRepository.getBlogById(userId);
  }

  @Get(':id/posts')
  async getAllBlogPosts(
    @Param('id') id: string,
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
      return await this.postsQueryRepository.getAllPosts(sortData, id, userId);
    } catch {
      throw new NotFoundException();
    }
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async createNew(@Body() inputModel: CreateBlogInputModel) {
    return await this.blogsService.createNewBlog(inputModel);
  }

  @Post(':id/posts')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPostToBlog(
    @Param('id') id: string,
    @Body() inputModel: CreatePostInputModelByBlog,
  ) {
    const PostCreateDto: CreatePostInputModel = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: id,
    };
    const newPostId = await this.postsService.createNewPost(PostCreateDto);
    return await this.postsQueryRepository.getPostById(newPostId);
  }

  @Put(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateById(
    @Param('id') id: string,
    @Body() inputModel: UpdateBlogInputModel,
  ) {
    await this.blogsService.updateBlog(id, inputModel);
    return;
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') userId: string) {
    return await this.blogsService.deleteBlog(userId);
  }
}
