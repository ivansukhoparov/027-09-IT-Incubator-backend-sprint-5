import { UserConfirmationCodeDto } from '../types/input';
import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { ERRORS_CODES, InterlayerNotice } from '../../../../base/models/interlayer.notice';
import { TokenPair } from '../types/output';

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

  async registerUser(registrationDto: UserCreateInputModel): Promise<InterlayerNotice<boolean>> {
    const interlayerNotice: InterlayerNotice<boolean> = new InterlayerNotice<boolean>();
    let user = await this.userService.getUserByLoginOrEmail(registrationDto.login);

    if (user) {
      interlayerNotice.addError('Login already exist', 'login', ERRORS_CODES.BAD_REQUEST);
      return interlayerNotice;
    }

    user = await this.userService.getUserByLoginOrEmail(registrationDto.email);

    if (user) {
      interlayerNotice.addError('Email already exist', 'email', ERRORS_CODES.BAD_REQUEST);
      return interlayerNotice;
    }
    const createdUserId = await this.userService.create(registrationDto, false);
    const createdUser = await this.userService.getUserById(createdUserId);
    if (!createdUser) {
      interlayerNotice.addError('Something wrong', 'server', ERRORS_CODES.EMAIL_SEND_ERROR);
      return interlayerNotice;
      // return false;
    }

    const emailConfirmationCode = this.confirmationCode.create({
      email: createdUser.email,
    });

    return await this.emailService.sendEmailConfirmationEmail(createdUser, emailConfirmationCode);
    // console.log(isSent);
    // if (isSent) {
    //   interlayerNotice.addData(true);
    //   return interlayerNotice;
    // }
  }

  async resendConfirmationCode(email: UserEmailDto): Promise<InterlayerNotice<boolean>> {
    const interlayerNotice: InterlayerNotice<boolean> = new InterlayerNotice<boolean>();
    const user = await this.userService.getUserByLoginOrEmail(email.email);

    if (!user) {
      interlayerNotice.addError('Email not found', 'email', ERRORS_CODES.BAD_REQUEST);
      return interlayerNotice;
    }

    if (user.isConfirmed) {
      interlayerNotice.addError('User already confirmed', 'confirmation', ERRORS_CODES.ALREADY_CONFIRMED);
      return interlayerNotice;
    }

    const emailConfirmationCode = this.confirmationCode.create({
      email: user.email,
    });

    return await this.emailService.sendEmailConfirmationEmail(user, emailConfirmationCode);
  }

  async confirmEmail(confirmationCode: UserConfirmationCodeDto): Promise<InterlayerNotice<boolean>> {
    const interlayerNotice: InterlayerNotice<boolean> = new InterlayerNotice<boolean>();
    const confirmationCodePayload = this.confirmationCode.decode(confirmationCode.code);

    if (!confirmationCodePayload) {
      interlayerNotice.addError('Invalid confirmation code', 'code', ERRORS_CODES.ALREADY_CONFIRMED);
      return interlayerNotice;
    }

    const user = await this.userService.getUserByLoginOrEmail(confirmationCodePayload.email);

    if (!user) {
      interlayerNotice.addError('Email not found', 'email', ERRORS_CODES.BAD_REQUEST);
      return interlayerNotice;
    }

    if (user.isConfirmed) {
      interlayerNotice.addError('User already confirmed', 'confirmation', ERRORS_CODES.ALREADY_CONFIRMED);
      return interlayerNotice;
    }

    // TODO rewrite using InterlayerNotice()
    const isStatusUpdated = await this.userService.updateUserConfirmationStatus(user.id);

    if (!isStatusUpdated) {
      interlayerNotice.addError('Can not update status', 'db', ERRORS_CODES.DATA_BASE_ERROR);
      return interlayerNotice;
    }
    interlayerNotice.addData(true);
    return interlayerNotice;
  }

  async refreshTokens(oldRefreshToken: string): Promise<InterlayerNotice<TokenPair>> {
    const interlayerNotice: InterlayerNotice<TokenPair> = new InterlayerNotice<TokenPair>();
    const isInBlackList = await this.refreshTokenRepository.findInBlackList(oldRefreshToken);
    const refreshTokenPayload = this.refreshToken.decode(oldRefreshToken);
    if (!refreshTokenPayload || isInBlackList) {
      interlayerNotice.addError('Refresh token not valid', 'refreshToken', ERRORS_CODES.INVALID_TOKEN);
      return interlayerNotice;
    }

    await this.refreshTokenRepository.addToBlackList(oldRefreshToken);

    const deviceId = refreshTokenPayload.deviceId;
    const userId = refreshTokenPayload.userId;

    const tokenPair: TokenPair = await this.devicesService.updateSession(userId, deviceId);
    interlayerNotice.addData(tokenPair);
    return interlayerNotice;
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

  async loginUser(loginDto: LoginInputModel, sessionInputModel: SessionInputModel): Promise<InterlayerNotice<TokenPair>> {
    const interlayerNotice: InterlayerNotice<TokenPair> = new InterlayerNotice<TokenPair>();
    const user = await this.userService.getUserByLoginOrEmail(loginDto.loginOrEmail);

    if (!user) {
      interlayerNotice.addError('Bad login or password', 'credentials', ERRORS_CODES.UNAUTHORIZED);
      return interlayerNotice;
    }

    const isSuccess = await this.cryptAdapter.compareHash(loginDto.password, user.hash);
    if (!isSuccess) {
      interlayerNotice.addError('Bad login or password', 'credentials', ERRORS_CODES.UNAUTHORIZED);
      return interlayerNotice;
    }

    const tokenPair: TokenPair = await this.devicesService.createSession(sessionInputModel, user);
    interlayerNotice.addData(tokenPair);
    return interlayerNotice;
  }

  async logout(oldRefreshToken: string): Promise<InterlayerNotice<boolean>> {
    const interlayerNotice: InterlayerNotice<boolean> = new InterlayerNotice<boolean>();
    const isInBlackList = await this.refreshTokenRepository.findInBlackList(oldRefreshToken);
    const refreshTokenPayload = this.refreshToken.decode(oldRefreshToken);

    if (!refreshTokenPayload || isInBlackList) {
      interlayerNotice.addError('Refresh token not valid', 'refreshToken', ERRORS_CODES.INVALID_TOKEN);
      return interlayerNotice;
    }

    const currentDeviceId = refreshTokenPayload.deviceId;

    await this.refreshTokenRepository.addToBlackList(oldRefreshToken);
    await this.devicesService.terminateSession(currentDeviceId, oldRefreshToken);
    interlayerNotice.addData(true);
    return interlayerNotice;
  }
}
