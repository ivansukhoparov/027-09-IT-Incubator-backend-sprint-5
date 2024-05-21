import { WithId } from 'mongodb';
import { BlogType, BlogOutputDto } from './output';

export const blogMapper = (blog: WithId<BlogType>): BlogOutputDto => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
