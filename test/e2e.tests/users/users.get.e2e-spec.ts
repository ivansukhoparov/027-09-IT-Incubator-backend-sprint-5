import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersTestManager } from '../../utils/test.manager.users';
import { creteTestApp } from '../../common/create.test.app';
import { TestViewModel } from '../../datasets/view.model';

describe.skip('sa/users GET test', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let usersTestManagerNotAuth: UsersTestManager;

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

  it('+ GET request should return correct ViewModel with empty array and status 200 IF NO USERS REGISTER', async () => {
    const res = await usersTestManager.getWithAuth();
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toEqual(new TestViewModel());
  });

  it(`+ GET request to '/sa/users' WITHOUT QUERY should return correct ViewModel with correct pagination,
  use additional method POST to '/sa/users' endpoint`, async () => {
    const users = await usersTestManager.createMany(20);
    const res = await usersTestManager.getWithAuth();
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toEqual(new TestViewModel(2, 1, 10, 20, users.splice(0, 10)));
  });

  it(`+ GET request to '/sa/users' WITH "searchEmailTerm=2" QUERY should return correct ViewModel with correct pagination,
  use additional method POST to '/sa/users' endpoint`, async () => {
    const query = '?searchEmailTerm=2';

    const users = await usersTestManager.createMany(20);
    const res = await usersTestManager.getWithAuth(query);
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toEqual(
      new TestViewModel(
        1,
        1,
        10,
        3,
        users.filter((user: any) => user.email.indexOf('2') > -1),
      ),
    );
  });

  it(`+ GET request to '/sa/users' WITH "sortBy=login&sortDirection=asc&pageSize=3&pageNumber=2" QUERY should return correct ViewModel with correct pagination,
  use additional method POST to '/sa/users' endpoint`, async () => {
    const query = '?searchLoginTerm=1&sortBy=login&sortDirection=asc&pageSize=3&pageNumber=2';

    const users = await usersTestManager.createMany(20);
    const res = await usersTestManager.getWithAuth(query);
    expect(res.statusCode).toBe(HttpStatus.OK);
    expect(res.body).toEqual(
      new TestViewModel(
        4,
        2,
        3,
        11,
        users
          .filter((user: any) => user.login.indexOf('1') > -1)
          .reverse()
          .slice(3, 6),
      ),
    );
  });

  it(`- GET request to '/sa/users' WITH WRONG CREDENTIALS should return status 401`, async () => {
    const res = await usersTestManagerNotAuth.getWithAuth();
    expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it(`- GET request to '/sa/users' WITH NO CREDENTIALS should return status 401`, async () => {
    const res = await usersTestManagerNotAuth.get();
    expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });
});
