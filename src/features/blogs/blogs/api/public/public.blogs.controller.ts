import { Controller, Get, NotFoundException, Param, Query, Req } from '@nestjs/common';
import { BlogsQueryRepository } from '../../infrastructure/blogs.query.repository';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query.repository';
import { Request } from 'express';
import { QueryUsersRequestType } from '../../../../users/types/input';
import { createQuery } from '../../../../common/create.query';
import { AccessToken } from '../../../../../common/token.services/access-token.service';

@Controller('blogs')
export class PublicBlogsController {
  constructor(
    protected readonly blogsQueryRepository: BlogsQueryRepository,
    protected readonly postsQueryRepository: PostsQueryRepository,
    protected readonly accessToken: AccessToken,
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

  @Get(':blogId/posts')
  async getAllBlogPosts(@Param('blogId') blogId: string, @Query() query: QueryUsersRequestType, @Req() req: Request) {
    const { sortData, searchData } = createQuery(query);

    try {
      try {
        const authHeader = req.header('authorization')?.split(' ');
        const accessTokenPayload = this.accessToken.decode(authHeader[1]);
        const userId = accessTokenPayload.userId;
        return await this.postsQueryRepository.getAllPosts(sortData, blogId, userId);
      } catch {
        return await this.postsQueryRepository.getAllPosts(sortData, blogId);
      }
    } catch {
      throw new NotFoundException();
    }
  }
}
