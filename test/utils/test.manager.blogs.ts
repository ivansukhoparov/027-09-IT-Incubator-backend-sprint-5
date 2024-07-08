import { INestApplication } from '@nestjs/common';
import { TestManagerBase } from './base/test.manager.base';
import { UserOutputModel } from '../../src/features/users/api/admin/models/user.ouput.model';
import { credentialsType, testsEndPoints, validAdminCredentials } from '../common/tests.settings';
import { ITestsCreateModel } from './base/tests.create.model.interface';
import { TestsCreateBlogModel } from '../e2e.tests/blogs/dataset/blogs.models';
import { BlogOutputDto } from '../../src/features/blogs/blogs/types/output';

export class BlogsTestManager extends TestManagerBase<BlogOutputDto> {
  constructor(
    protected readonly app: INestApplication,
    protected accessData: credentialsType = validAdminCredentials,
    protected createModel: ITestsCreateModel = new TestsCreateBlogModel(),
    public endPoint: string = testsEndPoints.blogsAdmin,
  ) {
    super(app, accessData, createModel, endPoint);
  }
}
