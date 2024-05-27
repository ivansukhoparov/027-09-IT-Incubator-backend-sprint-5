import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blogs.schema';
import { Model } from 'mongoose';
import { BlogOutputDto } from '../types/output';
import { blogMapper } from '../types/mapper';
import { QuerySearchType, QuerySortType } from '../../../common/types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async getAllBlogs(sortData: QuerySortType, searchData: QuerySearchType) {
    let searchKey = {};

    // check if have searchNameTerm create search key
    if (searchData.searchNameTerm)
      searchKey = {
        name: { $regex: searchData.searchNameTerm, $options: 'i' },
      };

    // calculate limits for DB request
    const documentsTotalCount = await this.blogModel.countDocuments(searchKey); // Receive total count of blogs
    const pageCount = Math.ceil(documentsTotalCount / +sortData.pageSize); // Calculate total pages count according to page size
    const skippedDocuments = (+sortData.pageNumber - 1) * +sortData.pageSize; // Calculate count of skipped docs before requested page

    // Get documents from DB
    const blogs = await this.blogModel
      .find(searchKey)
      .sort({ [sortData.sortBy]: sortData.sortDirection })
      .skip(+skippedDocuments)
      .limit(+sortData.pageSize)
      .lean();

    return {
      pagesCount: pageCount,
      page: +sortData.pageNumber,
      pageSize: +sortData.pageSize,
      totalCount: documentsTotalCount,
      items: blogs.map(blogMapper),
    };
  }

  async getBlogById(blogId: string): Promise<BlogOutputDto> {
    try {
      const blog: BlogDocument = await this.blogModel.findById(blogId);
      if (!blog) throw new NotFoundException();
      return blogMapper(blog);
    } catch {
      throw new NotFoundException();
    }
  }
}
