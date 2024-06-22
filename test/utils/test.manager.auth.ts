import { INestApplication } from '@nestjs/common';
import { credentialsType } from '../common/tests.settings';
import { ITestsCreateModel } from './base/tests.create.model.interface';
import request from 'supertest';
import { LoginInputModel } from '../../src/features/security/auth/api/models/login.input.model';
import { UserCreateInputModel } from '../../src/features/users/api/admin/models/user.create.input.model';

export class AuthTestManager {
  constructor(
    protected readonly app: INestApplication,
    protected endPoint: string = '/auth',
  ) {}

  async getMeInfo(accessToken: string) {
    return await request(this.app.getHttpServer())
      .get(this.endPoint + '/me')
      .set('authorization', 'Bearer ' + accessToken);
  }

  async loginUser(credentials: LoginInputModel, ip: string = '1.2.3.4', device: string = 'tests_device') {
    return await request(this.app.getHttpServer())
      .post(this.endPoint + '/login')
      .set('user-agent', device)
      .set('Remote-Addr', ip)
      .send(credentials);
  }

  async logoutUser(refreshToken: string) {
    return await request(this.app.getHttpServer())
      .post(this.endPoint + '/logout')
      .set('Cookie', ['refreshToken=' + refreshToken]);
  }

  async getNewRefreshToken(refreshToken: string) {
    return await request(this.app.getHttpServer())
      .post(this.endPoint + '/refresh-token')
      .set('Cookie', ['refreshToken=' + refreshToken]);
  }

  recoveryPassword() {}

  setNewPassword() {}

  async registration(registrationData: UserCreateInputModel) {
    return await request(this.app.getHttpServer())
      .post(this.endPoint + '/registration')
      .send(registrationData);
  }

  confirmRegistration() {}

  resendConfirmationCode() {}
}
