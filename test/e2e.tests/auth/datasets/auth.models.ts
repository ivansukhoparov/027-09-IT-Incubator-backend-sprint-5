export class TestsRegistrationModel {
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

export const authRegistrationModelNoLogin = {
  password: 'string',
  email: 'example@example.com',
};
export const authRegistrationNoPassword = {
  login: 'UserName',
  email: 'example@example.com',
};
export const authRegistrationNoEmail = {
  login: 'UserName',
  password: 'string',
};
export const authRegistrationNoData = {};
