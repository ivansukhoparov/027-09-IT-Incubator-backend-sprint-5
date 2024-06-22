import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersTestManager } from '../../utils/test.manager.users';
import { creteTestApp } from '../../common/create.test.app';
import { AuthTestManager } from '../../utils/test.manager.auth';
import { TestsCreateUserModel } from '../users/dataset/users.models';
import { UserOutputModel } from '../../../src/features/users/api/admin/models/user.ouput.model';
import { appSettings } from '../../../src/settings/app.settings';
import * as process from 'process';

type UserTestType = UserOutputModel & {
  password?: string;
  accessToken?: string;
  oldAccessToken?: string;
  refreshToken?: string;
  oldRefreshToken?: string;
};

const getRefreshTokenFromResponse = (res) => {
  return res.headers['set-cookie'][0].split(';')[0].split('=')[1];
};

let user1: UserTestType;
let user2: UserTestType;

describe('Auth tests', () => {
  let app: INestApplication;
  let authTestManager: AuthTestManager;
  let usersTestManager: UsersTestManager;

  beforeAll(async () => {
    // Use this to change tokens expiration tine
    appSettings.api.ACCESS_TOKEN_EXPIRATION_TIME = '5s';
    appSettings.api.REFRESH_TOKEN_EXPIRATION_TIME = '8s';
    // appSettings.api.EMAIL_CONFIRMATION_EXPIRATION_TIME = "10s"
    // appSettings.api.RECOVERY_TOKEN_EXPIRATION_TIME = "10s"

    app = await creteTestApp();
    authTestManager = new AuthTestManager(app);
    usersTestManager = new UsersTestManager(app);

    const deleteAll = await request(app.getHttpServer()).delete('/testing/all-data');
    expect(deleteAll.statusCode).toBe(HttpStatus.NO_CONTENT);

    await usersTestManager.createOne(new TestsCreateUserModel(1)).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.CREATED);
      user1 = res.body;
    });
    user1.password = 'string';

    await usersTestManager.createOne(new TestsCreateUserModel(2)).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.CREATED);
      user2 = res.body;
    });
    user2.password = 'string';
  });

  afterAll(async () => {});

  beforeEach(async () => {});

  afterEach(async () => {});

  it(`- POST request to "login" endpoint shouldn't login if credentials incorrect, and  return error message 
  with code 401`, async () => {
    await authTestManager
      .loginUser({
        loginOrEmail: 'uuser',
        password: 'psword',
      })
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(res.body).toEqual('Bad login or password');
      });
  });

  it(`- POST request to "login" endpoint shouldn't login user with correct login if password incorrect, 
  and return error message with code 401`, async () => {
    await authTestManager
      .loginUser({
        loginOrEmail: user1.login,
        password: 'psword',
      })
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(res.body).toEqual('Bad login or password');
      });
  });

  it(`+ POST request to "login" endpoint should login user_1 with correct credentials, 
  and return code 200, access token in body and refresh token in cookies`, async () => {
    await authTestManager
      .loginUser({
        loginOrEmail: user1.login,
        password: 'string',
      })
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.OK);
        expect(res.body).toEqual({ accessToken: expect.any(String) });
        expect(getRefreshTokenFromResponse(res)).not.toBeUndefined();
        expect(getRefreshTokenFromResponse(res)).toEqual(expect.any(String));
        user1.accessToken = res.body.accessToken;
        user1.refreshToken = getRefreshTokenFromResponse(res);
      });
  });

  it(`+ GET request to "me" endpoint for user 1 should  return correct user info with code 200 `, async () => {
    await authTestManager.getMeInfo(user1.accessToken).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        email: user1.email,
        login: user1.login,
        userId: user1.id,
      });
    });
  });

  it(`+ GET request to "me" endpoint for user 1 should code 401 after 10 sec awaiting`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await authTestManager.getMeInfo(user1.accessToken).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`+ GET request to "me" endpoint with incorrect access token  should return code 401 `, async () => {
    const invalidAccess =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NjM5MzgyMS1jMTQzLTRkYjItYmMyZi00NzI3OTlhYTBjN2IiLCJpYXQiOjE3MTg1Nzk4NzAsImV4cCI6MTcxODU4MDE3MH0._DyFvZjICJgLCRGiJSnNHojr_0BTt67SqHSboRAJjTI';
    await authTestManager.getMeInfo(invalidAccess).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`- POST request to "refresh-token" endpoint with incorrect refresh token  should return code 401 `, async () => {
    const invalidAccess =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NjM5MzgyMS1jMTQzLTRkYjItYmMyZi00NzI3OTlhYTBjN2IiLCJpYXQiOjE3MTg1Nzk4NzAsImV4cCI6MTcxODU4MDE3MH0._DyFvZjICJgLCRGiJSnNHojr_0BTt67SqHSboRAJjTI';
    await authTestManager.getMeInfo(invalidAccess).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`+ POST request to "refresh-token" endpoint with correct refresh token should return code 200 and new pair of refresh and access tokens `, async () => {
    await authTestManager.getNewRefreshToken(user1.refreshToken).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toEqual({ accessToken: expect.any(String) });
      expect(getRefreshTokenFromResponse(res)).not.toBeUndefined();
      expect(getRefreshTokenFromResponse(res)).toEqual(expect.any(String));
      user1.oldAccessToken = user1.accessToken;
      user1.oldRefreshToken = user1.refreshToken;
      user1.accessToken = res.body.accessToken;
      user1.refreshToken = getRefreshTokenFromResponse(res);
    });
  });

  it(`- POST request to "refresh-token" endpoint with old refresh token should return code 401 `, async () => {
    await authTestManager.getNewRefreshToken(user1.oldRefreshToken).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`+ POST request to "refresh-token" endpoint with correct refresh token should return code 401 if token has been expired `, async () => {
    await new Promise((resolve) => setTimeout(resolve, 9000));

    await authTestManager.getNewRefreshToken(user1.refreshToken).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it(`+ POST request to "login" endpoint should login user_2 with correct credentials, 
  and return code 200, access token in body and refresh token in cookies`, async () => {
    await authTestManager
      .loginUser({
        loginOrEmail: user2.login,
        password: 'string',
      })
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.OK);
        expect(res.body).toEqual({ accessToken: expect.any(String) });
        expect(getRefreshTokenFromResponse(res)).not.toBeUndefined();
        expect(getRefreshTokenFromResponse(res)).toEqual(expect.any(String));
        user2.accessToken = res.body.accessToken;
        user2.refreshToken = getRefreshTokenFromResponse(res);
      });
  });

  it(`+ POST request to "logout" endpoint for user 2 should  return status code 204;
     shouldnt return new access token just code 401 `, async () => {
    await authTestManager.logoutUser(user2.refreshToken).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);
    });
  });

  it(`- POST request to "refresh-token" endpoint with correct refresh token shouldnt return new pair after login `, async () => {
    await authTestManager.getNewRefreshToken(user2.refreshToken).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
