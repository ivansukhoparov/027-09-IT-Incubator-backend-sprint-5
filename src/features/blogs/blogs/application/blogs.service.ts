import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Injectable } from '@nestjs/common';
import { Blog } from '../infrastructure/blogs.schema';
import { blogMapper } from '../types/mapper';
import { CreateBlogInputModel, UpdateBlogInputModel } from '../api/admin/models/blogs.input.models';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async getBlogById(id: string) {
    return this.blogsRepository.getBlogById(id);
  }

  async isBLogExist(id: string) {
    return await this.blogsRepository.isBlogExist(id);
  }

  async createNewBlog(inputModel: CreateBlogInputModel) {
    const createdAt = new Date();

    const newBlogData: Blog = {
      name: inputModel.name,
      description: inputModel.description,
      websiteUrl: inputModel.websiteUrl,
      createdAt: createdAt.toISOString(),
      isMembership: false,
    };

    const newBlogId = await this.blogsRepository.createBlog(newBlogData);
    const newBlog = await this.blogsRepository.getBlogById(newBlogId);
    return blogMapper(newBlog);
  }

  async updateBlog(blogId: string, blogUpdateDto: UpdateBlogInputModel) {
    const result = await this.blogsRepository.updateBlog(blogId, blogUpdateDto);
  }

  async deleteBlog(blogId: string) {
    await this.blogsRepository.deleteBlog(blogId);
  }
}
