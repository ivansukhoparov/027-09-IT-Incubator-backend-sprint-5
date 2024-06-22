import { UserConfirmationCodeDto } from '../types/input';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../../users/application/users.service';
import { EmailService } from '../../../../common/email/email.service';
import { BcryptAdapter } from '../../../../common/adapters/bcrypt.adapter';
import { RefreshTokenRepository } from '../infrastructure/refresh.token.repository';
import { UserCreateInputModel } from '../../../users/api/admin/models/user.create.input.model';
import { EmailConfirmationCode } from '../../../../common/token.services/email-confirmation-code.service';
import { LoginInputModel, UserEmailDto } from '../api/models/login.input.model';
import { RefreshToken } from '../../../../common/token.services/refresh-token.service';
import { SessionInputModel } from '../../devices/api/models/session.input.models';
import { UserDocument } from '../../../users/infrastructure/users.schema';
import { DevicesService } from '../../devices/application/devices.service';
import { AccessToken } from '../../../../common/token.services/access-token.service';

@Injectable()
export class AuthService {
  constructor(
    protected readonly userService: UsersService,
    protected readonly emailService: EmailService,
    protected readonly cryptAdapter: BcryptAdapter,
    protected readonly accessToken: AccessToken,
    protected readonly refreshToken: RefreshToken,
    protected readonly confirmationCode: EmailConfirmationCode,
    protected refreshTokenRepository: RefreshTokenRepository,
    protected devicesService: DevicesService,
  ) {}

  async registerUser(registrationDto: UserCreateInputModel) {
    let user = await this.userService.getUserByLoginOrEmail(
      registrationDto.login,
    );

    // TODO fix it - change to native Error
    if (user)
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'invalid field',
            field: 'login',
          },
        ],
      });
    user = await this.userService.getUserByLoginOrEmail(registrationDto.email);
    // TODO fix it - change to native Error
    if (user)
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'invalid field',
            field: 'email',
          },
        ],
      });

    const createdUserId = await this.userService.create(registrationDto, false);
    const createdUser = await this.userService.getUserById(createdUserId);
    if (!createdUser) return false;

    const emailConfirmationCode = this.confirmationCode.create({
      email: createdUser.email,
    });

    const isEmailSent = await this.emailService.sendEmailConfirmationEmail(
      createdUser,
      emailConfirmationCode,
    );

    if (!isEmailSent) {
      await this.userService.delete(createdUser.id);
      return false;
    }

    return true;
  }

  async resendConfirmationCode(email: UserEmailDto) {
    const user = await this.userService.getUserByLoginOrEmail(email.email);
    // TODO fix it - change to native Error
    if (!user || user.isConfirmed)
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'email exist',
            field: 'email',
          },
        ],
      });

    const emailConfirmationCode = this.confirmationCode.create({
      email: user.email,
    });

    return await this.emailService.sendEmailConfirmationEmail(
      user,
      emailConfirmationCode,
    );
  }

  async confirmEmail(confirmationCode: UserConfirmationCodeDto) {
    const refreshTokenPayload = this.confirmationCode.decode(
      confirmationCode.code,
    );

    // TODO fix it - change to native Error
    if (!refreshTokenPayload)
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'email exist',
            field: 'code',
          },
        ],
      });

    const user = await this.userService.getUserByLoginOrEmail(
      refreshTokenPayload.email,
    );

    // TODO fix it - change to native Error
    if (!user || user.isConfirmed)
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'email exist',
            field: 'code',
          },
        ],
      });

    return await this.userService.updateUserConfirmationStatus(user.id);
  }

  async refreshTokens(oldRefreshToken: string) {
    const isInBlackList =
      await this.refreshTokenRepository.findInBlackList(oldRefreshToken);

    const refreshTokenPayload = this.refreshToken.decode(oldRefreshToken);
    if (!refreshTokenPayload || isInBlackList)
      throw new UnauthorizedException();

    await this.refreshTokenRepository.addToBlackList(oldRefreshToken);

    const deviceId = refreshTokenPayload.deviceId;
    const userId = refreshTokenPayload.userId;

    return await this.devicesService.updateSession(userId, deviceId);
  }

  // async passwordRecoveryCode(email: string) {
  //   // Check email is exist
  //   const user = await this.usersRepository.getUserByLoginOrEmail(email);
  //   if (!user) return;
  //
  //   // Create recovery code and write down it to db with email and user id
  //   const recoveryCode = this._createRecoveryCode(user.id);
  //
  //   // Send email with recovery code
  //   const isEmailSend: boolean = await EmailAdapter.sendPasswordRecoveryCode(user, recoveryCode);
  //   return;
  // }
  //
  // async setNewPassword({newPassword, recoveryCode}:PasswordRecoveryRequestType){
  //   const isVerified = await Tokens.verifyPasswordRecoveryToken(recoveryCode);
  //   if (!isVerified) return false;
  //
  //   const userId = await Tokens.decodePasswordRecoveryToken(recoveryCode);
  //   if (!userId) return false;
  //
  //   const newPasswordHash = await Password.getNewHash(newPassword);
  //   const isUpdated = await this.usersRepository.updateUserPasswordHash(userId,newPasswordHash);
  //
  //   return isUpdated;
  //
  // }

  async loginUser(
    loginDto: LoginInputModel,
    sessionInputModel: SessionInputModel,
  ) {
    const user: UserDocument = await this.userService.getUserByLoginOrEmail(
      loginDto.loginOrEmail,
    );
    if (!user)
      throw new HttpException('Bad login or password', HttpStatus.UNAUTHORIZED);

    const isSuccess = await this.cryptAdapter.compareHash(
      loginDto.password,
      user.hash,
    );
    if (!isSuccess)
      throw new HttpException('Bad login or password', HttpStatus.UNAUTHORIZED);

    return await this.devicesService.createSession(sessionInputModel, user);
  }

  async logout(oldRefreshToken: string) {
    const isInBlackList =
      await this.refreshTokenRepository.findInBlackList(oldRefreshToken);

    const refreshTokenPayload = this.refreshToken.decode(oldRefreshToken);
    if (!refreshTokenPayload || isInBlackList) {
      console.log('in black list');
      throw new UnauthorizedException();
    }

    const currentDeviceId = refreshTokenPayload.deviceId;
    await this.refreshTokenRepository.addToBlackList(oldRefreshToken);
    await this.devicesService.terminateSession(
      currentDeviceId,
      oldRefreshToken,
    );
  }
}
