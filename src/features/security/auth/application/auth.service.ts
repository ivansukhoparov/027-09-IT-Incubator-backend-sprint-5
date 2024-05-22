import {
  UserConfirmationCodeDto,
  UserLoginDto,
  UserRegistrationDto,
} from '../types/input';
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
import { EmailConfirmationCodeService } from '../../../../common/token.services/email.confirmation.code.service';
import { tokenServiceCommands } from '../../../../common/token.services/utils/common';
import { LoginInputModel, UserEmailDto } from '../api/models/login.input.model';
import { RefreshTokenService } from '../../../../common/token.services/refresh.token.service';
import { SessionInputModel } from '../../devices/api/models/session.input.models';
import { UserDocument } from '../../../users/infrastructure/users.schema';
import { DevicesService } from '../../devices/application/devices.service';

class SessionsService {}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly cryptAdapter: BcryptAdapter,
    protected refreshTokenRepository: RefreshTokenRepository,
    protected sessionService: DevicesService,
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

    const emailConfirmationCode = new EmailConfirmationCodeService(
      tokenServiceCommands.create,
      { email: createdUser.email },
    );

    const isEmailSent = await this.emailService.sendEmailConfirmationEmail(
      createdUser,
      emailConfirmationCode.get(),
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

    const emailConfirmationCode = new EmailConfirmationCodeService(
      tokenServiceCommands.create,
      { email: email.email },
    );

    return await this.emailService.reSendEmailConfirmationEmail(
      user,
      emailConfirmationCode.get(),
    );
  }

  async confirmEmail(confirmationCode: UserConfirmationCodeDto) {
    const emailConfirmationCode = new EmailConfirmationCodeService(
      'set',
      confirmationCode.code,
    );

    // TODO fix it - change to native Error
    if (!emailConfirmationCode.verify())
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'email exist',
            field: 'code',
          },
        ],
      });

    const user = await this.userService.getUserByLoginOrEmail(
      emailConfirmationCode.decode().email,
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
    const _oldRefreshToken = new RefreshTokenService('set', oldRefreshToken);
    const isInBlackList =
      await this.refreshTokenRepository.findInBlackList(oldRefreshToken);

    if (!_oldRefreshToken.verify() || isInBlackList)
      throw new UnauthorizedException();

    await this.refreshTokenRepository.addToBlackList(oldRefreshToken);

    const deviceId = _oldRefreshToken.decode().deviceId;
    const userId = _oldRefreshToken.decode().userId;

    return await this.sessionService.updateSession(userId, deviceId);
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

    return await this.sessionService.createSession(sessionInputModel, user);
  }

  async logout(oldRefreshToken: string) {
    const refreshToken = new RefreshTokenService('set', oldRefreshToken);
    const isInBlackList =
      await this.refreshTokenRepository.findInBlackList(oldRefreshToken);

    if (!refreshToken.verify() || isInBlackList)
      throw new UnauthorizedException();

    const currentDeviceId = refreshToken.decode().deviceId;
    await this.refreshTokenRepository.addToBlackList(oldRefreshToken);
    await this.sessionService.terminateSession(
      currentDeviceId,
      refreshToken.get(),
    );
  }
}
