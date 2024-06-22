import { ObjectId } from 'mongodb';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsLikes } from './likes.schema';
import { Model } from 'mongoose';
import { Post } from '../../posts/infrastructure/posts.schema';

@Injectable()
export class PostsLikesRepository {
  constructor(
    @InjectModel(PostsLikes.name) private postsLikesModel: Model<PostsLikes>,
    @InjectModel(Post.name) private postsModel: Model<Post>,
  ) {}

  async update(updateModel: PostsLikes) {
    try {
      const post = await this.postsModel.findOne({
        _id: new ObjectId(updateModel.postId),
      });
      if (!post) throw new NotFoundException();
      const like = await this.postsLikesModel.findOne({
        $and: [{ likeOwnerId: updateModel.likeOwnerId }, { postId: updateModel.postId }],
      });
      if (like) {
        like.status = updateModel.status;
        like.save();
      } else {
        await this.postsLikesModel.create(updateModel);
      }
    } catch {
      throw NotFoundException;
    }
  }
}
