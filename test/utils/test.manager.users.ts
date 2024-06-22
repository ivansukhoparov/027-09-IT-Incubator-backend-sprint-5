import { UserOutputModel } from '../../src/features/users/api/admin/models/user.ouput.model';
import { TestManagerBase } from './base/test.manager.base';
import { TestsCreateUserModel } from '../e2e.tests/users/dataset/users.models';
import { INestApplication } from '@nestjs/common';
import { credentialsType, testsEndPoints, validAdminCredentials } from '../common/tests.settings';
import { ITestsCreateModel } from './base/tests.create.model.interface';

export class UsersTestManager extends TestManagerBase<UserOutputModel> {
  constructor(
    protected readonly app: INestApplication,
    protected accessData: credentialsType = validAdminCredentials,
    protected createModel: ITestsCreateModel = new TestsCreateUserModel(),
    protected endPoint: string = testsEndPoints.usersAdmin,
  ) {
    super(app, accessData, createModel, endPoint);
  }
}
