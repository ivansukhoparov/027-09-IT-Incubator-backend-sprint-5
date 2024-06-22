import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, UseGuards, Req } from '@nestjs/common';
import { BlogsService } from '../../application/blogs.service';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query.repository';
import { PostsService } from '../../../posts/application/posts.service';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query.repository';
import { CreateBlogInputModel, UpdateBlogInputModel } from './models/blogs.input.models';
import { Request } from 'express';
import { CreatePostInputModel, CreatePostInputModelByBlog, UpdatePostInputModel } from '../../../posts/api/models/posts.input.models';
import { QueryUsersRequestType } from '../../../../users/types/input';
import { createQuery } from '../../../../common/create.query';
import { AccessToken } from '../../../../../common/token.services/access-token.service';
import { AdminAuthGuard } from '../../../../../infrastructure/guards/admin-auth-guard.service';

@Controller('sa/blogs')
@UseGuards(AdminAuthGuard)
export class AdminBlogsController {
  constructor(
    protected readonly blogsService: BlogsService,
    protected readonly postsService: PostsService,
    protected readonly blogsQueryRepository: BlogsQueryRepository,
    protected readonly postsQueryRepository: PostsQueryRepository,
    protected readonly accessToken: AccessToken,
  ) {}

  @Get()
  async getAll(@Query() query: QueryUsersRequestType) {
    const { sortData, searchData } = createQuery(query);
    return await this.blogsQueryRepository.getAllBlogs(sortData, searchData);
  }

  @Post()
  async createNew(@Body() inputModel: CreateBlogInputModel) {
    return await this.blogsService.createNewBlog(inputModel);
  }

  @Put(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateById(@Param('blogId') blogId: string, @Body() inputModel: UpdateBlogInputModel) {
    await this.blogsService.updateBlog(blogId, inputModel);
    return;
  }

  @Delete(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('blogId') blogId: string) {
    return await this.blogsService.deleteBlog(blogId);
  }

  // Section for working with posts through blogs controller
  @Get(':blogId/posts')
  async getAllBlogPosts(@Param('blogId') blogId: string, @Query() query: QueryUsersRequestType, @Req() req: Request) {
    const { sortData, searchData } = createQuery(query);

    try {
      const authHeader = req.header('authorization')?.split(' ');
      const accessTokenPayload = this.accessToken.decode(authHeader[1]);
      const userId = accessTokenPayload.userId;
      return await this.postsQueryRepository.getAllPosts(sortData, blogId, userId);
    } catch {
      throw new NotFoundException();
    }
  }

  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostToBlog(@Param('blogId') blogId: string, @Body() inputModel: CreatePostInputModelByBlog) {
    const isBLogExist = await this.blogsService.isBLogExist(blogId);
    if (isBLogExist) {
      const PostCreateDto: CreatePostInputModel = {
        title: inputModel.title,
        shortDescription: inputModel.shortDescription,
        content: inputModel.content,
        blogId: blogId,
      };
      const newPostId = await this.postsService.createNewPost(PostCreateDto);
      return await this.postsQueryRepository.getPostById(newPostId);
    } else {
      throw new NotFoundException();
    }
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostById(@Param('postId') postId: string, @Param('blogId') blogId: string, @Body() inputModel: UpdatePostInputModel) {
    const isBLogExist = await this.blogsService.isBLogExist(blogId);
    if (isBLogExist) {
      await this.postsService.updatePost(postId, inputModel, blogId);
      return {};
    } else {
      throw new NotFoundException();
    }
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostsById(@Param('postId') postId: string, @Param('blogId') blogId: string) {
    const isBLogExist = await this.blogsService.isBLogExist(blogId);
    if (isBLogExist) {
      await this.postsService.deletePost(postId);
      return;
    } else {
      throw new NotFoundException();
    }
  }
}
