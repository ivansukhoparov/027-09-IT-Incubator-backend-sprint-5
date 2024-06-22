import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersTestManager } from '../../utils/test.manager.users';
import { ErrorsResponse } from '../../datasets/dataset';
import { creteTestApp } from '../../common/create.test.app';
import { TestViewModel } from '../../datasets/view.model';
import { TestsCreateUserModel } from './dataset/users.models';

describe.skip('sa/users GET test', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let usersTestManagerNotAuth: UsersTestManager;
  const errorsResponse: ErrorsResponse = new ErrorsResponse();

  beforeAll(async () => {
    app = await creteTestApp();

    usersTestManager = new UsersTestManager(app);
    usersTestManagerNotAuth = new UsersTestManager(app, {
      user: 'notAdmin',
      password: 'wrongPassword',
    });
  });

  afterAll(async () => {});

  beforeEach(async () => {
    const deleteAll = await request(app.getHttpServer()).delete('/testing/all-data');
    expect(deleteAll.statusCode).toBe(HttpStatus.NO_CONTENT);
  });

  it(`+ DELETE request to '/sa/users' WITH correct ID should delete user and return 204 status code,
  use additional methods POST/GET to '/sa/users' endpoint`, async () => {
    const users = await usersTestManager.createMany(3);

    // check whether users have been created or not
    const res_1 = await usersTestManager.getWithAuth();
    expect(res_1.statusCode).toBe(HttpStatus.OK);
    expect(res_1.body.items).toEqual(users);

    // delete users with index 0
    const res_2 = await usersTestManager.delete(users[0].id);
    expect(res_2.statusCode).toBe(HttpStatus.NO_CONTENT);

    // check whether user have been deleted or not
    const res_3 = await usersTestManager.getWithAuth();
    expect(res_3.statusCode).toBe(HttpStatus.OK);
    expect(res_3.body.items).toEqual(users.slice(1));
  });

  it(`- DELETE request to '/sa/users' WITH NOT EXISTING ID should return 404 status code,
  use additional methods POST/GET to '/sa/users' endpoint`, async () => {
    const users = await usersTestManager.createMany(3);

    // check whether users have been created or not
    const res_1 = await usersTestManager.getWithAuth();
    expect(res_1.statusCode).toBe(HttpStatus.OK);
    expect(res_1.body.items).toEqual(users);

    // delete user with invalid ID
    const res_2 = await usersTestManager.delete('6c38f5e4-3f5b-4607-bb88-00d723af4634');
    expect(res_2.statusCode).toBe(HttpStatus.NOT_FOUND);

    // check whether user have been deleted or not
    const res_3 = await usersTestManager.getWithAuth();
    expect(res_3.statusCode).toBe(HttpStatus.OK);
    expect(res_3.body.items).toEqual(users);
  });

  it(`- DELETE request to '/sa/users' WITH INCORRECT ID should return 404 status code,
  use additional methods POST/GET to '/sa/users' endpoint`, async () => {
    const users = await usersTestManager.createMany(3);

    // check whether users have been created or not
    const res_1 = await usersTestManager.getWithAuth();
    expect(res_1.statusCode).toBe(HttpStatus.OK);
    expect(res_1.body.items).toEqual(users);

    // delete user with invalid ID
    const res_2 = await usersTestManager.delete('just some random string');
    expect(res_2.statusCode).toBe(HttpStatus.NOT_FOUND);

    // check whether user have been deleted or not
    const res_3 = await usersTestManager.getWithAuth();
    expect(res_3.statusCode).toBe(HttpStatus.OK);
    expect(res_3.body.items).toEqual(users);
  });

  it(`- DELETE request to '/sa/users' WITH INCORRECT DREDENTIALS should return 401 status code,
  use additional methods POST/GET to '/sa/users' endpoint`, async () => {
    const users = await usersTestManager.createMany(3);

    // check whether users have been created or not
    const res_1 = await usersTestManager.getWithAuth();
    expect(res_1.statusCode).toBe(HttpStatus.OK);
    expect(res_1.body.items).toEqual(users);

    // delete users with index 0
    const res_2 = await usersTestManagerNotAuth.delete(users[0].id);
    expect(res_2.statusCode).toBe(HttpStatus.UNAUTHORIZED);

    // check whether user have been deleted or not
    const res_3 = await usersTestManager.getWithAuth();
    expect(res_3.statusCode).toBe(HttpStatus.OK);
    expect(res_3.body.items).toEqual(users);
  });
});
