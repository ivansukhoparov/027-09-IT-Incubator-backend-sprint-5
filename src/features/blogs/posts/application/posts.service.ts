import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { Post } from '../infrastructure/posts.schema';
import { BlogDocument } from '../../blogs/infrastructure/blogs.schema';
import {
  CreatePostInputModel,
  UpdatePostInputModel,
} from '../api/models/posts.input.models';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
  ) {}

  async findById(id: string) {
    return await this.postsRepository.getPostById(id);
  }

  async createNewPost(createPostInputModel: CreatePostInputModel) {
    const createdAt = new Date();

    const parentBlog: BlogDocument = await this.blogsRepository.getBlogById(
      createPostInputModel.blogId,
    );

    if (!parentBlog) throw new NotFoundException();

    const newPostDto: Post = {
      title: createPostInputModel.title,
      shortDescription: createPostInputModel.shortDescription,
      content: createPostInputModel.content,
      blogId: createPostInputModel.blogId,
      blogName: parentBlog.name,
      createdAt: createdAt.toISOString(),
    };

    const newPostId = await this.postsRepository.createPost(newPostDto);
    return newPostId;
  }

  async updatePost(id: string, updateDto: UpdatePostInputModel) {
    await this.postsRepository.updatePost(id, updateDto);
  }

  async deletePost(id: string) {
    await this.postsRepository.deletePost(id);
  }
}
