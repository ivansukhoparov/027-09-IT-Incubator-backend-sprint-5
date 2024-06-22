import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Get,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserConfirmationCodeDto } from '../types/input';
import { AuthService } from '../application/auth.service';
import { LoginInputModel, UserEmailDto } from './models/login.input.model';
import { Response, Request } from 'express';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query.repository';
import { AuthGuard } from '../../../../infrastructure/guards/admin-auth-guard.service';
import { AccessToken } from '../../../../common/token.services/access-token.service';
import { UserCreateInputModel } from '../../../users/api/admin/models/user.create.input.model';
import { SessionInputModel } from '../../devices/api/models/session.input.models';
import { RefreshToken } from '../../../../common/token.services/refresh-token.service';
import { interlayerNoticeHandler } from '../../../../base/models/interlayer.notice';
import { TokenPair } from '../types/output';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    protected readonly authService: AuthService,
    protected readonly usersQueryRepository: UsersQueryRepository,
    protected readonly accessToken: AccessToken,
    protected readonly refreshToken: RefreshToken,
  ) {}

  @SkipThrottle()
  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    try {
      const authHeader = req.header('authorization')?.split(' ');
      const accessTokenPayload = this.accessToken.decode(authHeader[1]);
      const userId = accessTokenPayload.userId;

      return this.usersQueryRepository.getUserAuthMe(userId);
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: UserCreateInputModel) {
    const interlayerNotice = await this.authService.registerUser(registrationDto);
    interlayerNoticeHandler(interlayerNotice);
    return;
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() confirmationCode: UserConfirmationCodeDto) {
    const interlayerNotice = await this.authService.confirmEmail(confirmationCode);
    interlayerNoticeHandler(interlayerNotice);
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() resendingRequestDto: UserEmailDto) {
    const interlayerNotice = await this.authService.resendConfirmationCode(resendingRequestDto);
    interlayerNoticeHandler(interlayerNotice);
    return;
  }

  @Post('password-recovery')
  async getPasswordRecoveryToken() {}

  @Post('new-password')
  async setNewPassword() {}

  @SkipThrottle()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async getNewRefreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const oldRefreshToken = req.headers['cookie'].split('=')[1];
      //const oldRefreshToken = req.cookies.refreshToken;
      const interlayerNotice = await this.authService.refreshTokens(oldRefreshToken);
      interlayerNoticeHandler(interlayerNotice);
      const tokens: TokenPair = interlayerNotice.data;

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return { accessToken: tokens.accessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginInputModel, @Req() req: Request) {
    const sessionInputModel: SessionInputModel = {
      deviceTitle: req.header('user-agent')?.split(' ')[1] || 'unknown',
      ip: req.ip || 'unknown',
    };
    const interlayerNotice = await this.authService.loginUser(loginDto, sessionInputModel);
    interlayerNoticeHandler(interlayerNotice);
    const tokens: TokenPair = interlayerNotice.data;

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    // console.log(refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @SkipThrottle()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    const refreshToken = req.headers['cookie'].split('=')[1];
    //const refreshToken = req.cookies.refreshToken;
    const interlayerNotice = await this.authService.logout(refreshToken);
    interlayerNoticeHandler(interlayerNotice);
    return;
  }
}
