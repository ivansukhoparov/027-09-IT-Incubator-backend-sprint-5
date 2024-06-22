import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Post, PostDocument } from './posts.schema';
import { PostUpdateDto } from '../types/input';
import { BlogDocument } from '../../blogs/infrastructure/blogs.schema';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(newPost: Post) {
    const result = await this.postModel.create(newPost);
    return result._id.toString();
  }

  async getPostById(id: string) {
    const post: PostDocument = await this.postModel.findById(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  async savePost(post: PostDocument) {
    await post.save();
    return post;
  }

  // update existing blog
  async updatePost(id: string, updateDto: PostUpdateDto) {
    try {
      const result = await this.postModel.findOneAndUpdate({ _id: new ObjectId(id) }, updateDto, { new: true });
      if (result) return true;
      else throw new NotFoundException();
    } catch {
      throw new NotFoundException();
    }
  }

  async deletePost(id: string) {
    try {
      const result = await this.postModel.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount !== 1) throw new NotFoundException();
    } catch {
      throw new NotFoundException();
    }
  }

  async isPostExist(id: string) {
    try {
      const blog: BlogDocument = await this.postModel.findById(id);
      return !!blog;
    } catch {
      return false;
    }
  }
}
