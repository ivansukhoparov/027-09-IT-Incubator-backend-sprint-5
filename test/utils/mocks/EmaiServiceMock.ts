import { Injectable } from '@nestjs/common';
import { UserType } from '../../../src/features/users/types/output';

@Injectable()
export class MockEmailService {
  constructor() {}

  async sendEmailConfirmationEmail(user: UserType, confirmationCode: string): Promise<boolean> {
    return new Promise((res) => {
      res(true);
    });
  }

  async reSendEmailConfirmationEmail(user: UserType, confirmationCode: string): Promise<boolean> {
    return new Promise((res) => {
      res(true);
    });
  }

  async sendPasswordRecoveryCode(user: UserType, recoveryCode: string): Promise<boolean> {
    return new Promise((res) => {
      res(true);
    });
  }
}
