import { ITestsCreateModel } from '../../../utils/base/tests.create.model.interface';

export class TestsCreateUserModel implements ITestsCreateModel {
  login: string = 'User';
  password: string = 'string';
  email: string = 'example@example.com';

  constructor(counter?: string | number) {
    if (counter) this.extendModel(counter);
  }

  extendModel(counter: string | number) {
    this.login = 'User_' + counter;
    this.email = 'example' + counter + '@example.com';
  }
}

export const userCreateModelNoLogin = {
  password: 'string',
  email: 'example@example.com',
};
export const userCreateModelNoPassword = {
  login: 'UserName',
  email: 'example@example.com',
};
export const userCreateModelNoEmail = {
  login: 'UserName',
  password: 'string',
};
export const userCreateModelNoData = {};
