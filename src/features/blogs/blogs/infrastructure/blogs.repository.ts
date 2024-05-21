import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blogs.schema';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { blogMapper } from '../types/mapper';
import { BlogUpdateDto } from '../types/input';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(newBlog: Blog) {
    const result = await this.blogModel.create(newBlog);
    return result._id.toString();
  }

  async getAllBlogs() {
    const blogs = await this.blogModel.find({}).lean();
    return blogs.map(blogMapper);
  }

  async isBlogExist(id: string) {
    try {
      const blog: BlogDocument = await this.blogModel.findById(id);
      return !!blog;
    } catch {
      return false;
    }
  }

  async getBlogById(blogId: string): Promise<BlogDocument> {
    const blog: BlogDocument = await this.blogModel.findById(blogId);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  async saveBlog(blog: BlogDocument) {
    await blog.save();
    return blog;
  }

  // update existing blog
  async updateBlog(id: string, updateDto: BlogUpdateDto) {
    try {
      const result = await this.blogModel.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: updateDto,
        },
      );
      if (!result) throw new NotFoundException();
    } catch {
      throw new NotFoundException();
    }
  }

  async deleteBlog(id: string) {
    try {
      const result = await this.blogModel.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount !== 1) throw new NotFoundException();
    } catch {
      throw new NotFoundException();
    }
  }
}
