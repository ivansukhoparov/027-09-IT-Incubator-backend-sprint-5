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
      .set('authorization', accessToken)
      .get(this.endPoint + '/login');
  }

  async loginUser(
    credentials: LoginInputModel,
    ip: string = '1.2.3.4',
    device: string = 'tests_device',
  ) {
    return await request(this.app.getHttpServer())
      .set('user-agent', device)
      .set('Remote-Addr', ip)
      .post(this.endPoint + '/login')
      .send(credentials);
  }

  logoutUser() {}

  getNewRefreshToken() {}

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
