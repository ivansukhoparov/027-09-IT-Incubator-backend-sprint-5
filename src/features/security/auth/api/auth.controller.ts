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
} from '@nestjs/common';
import { UserConfirmationCodeDto } from '../types/input';
import { AuthService } from '../application/auth.service';
import { LoginInputModel, UserEmailDto } from './models/login.input.model';
import { Response, Request } from 'express';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query.repository';
import { AuthGuard } from '../../../../infrastructure/guards/admin-auth-guard.service';
import { AccessTokenService } from '../../../../common/token.services/access.token.service';
import { tokenServiceCommands } from '../../../../common/token.services/utils/common';
import { UserCreateInputModel } from '../../../users/api/models/user.create.input.model';
import { SessionInputModel } from '../../devices/api/models/session.input.models';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @SkipThrottle()
  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    try {
      const authHeader = req.header('authorization')?.split(' ');
      const token = new AccessTokenService(
        tokenServiceCommands.set,
        authHeader[1],
      );
      const userId = token.decode().userId;
      return this.usersQueryRepository.getUserAuthMe(userId);
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: UserCreateInputModel) {
    const isSuccess = await this.authService.registerUser(registrationDto);
    if (isSuccess) return;
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() confirmationCode: UserConfirmationCodeDto,
  ) {
    const isSuccess = await this.authService.confirmEmail(confirmationCode);
    if (isSuccess) return;
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() resendingRequestDto: UserEmailDto) {
    const isSuccess =
      await this.authService.resendConfirmationCode(resendingRequestDto);
    if (isSuccess) return;
  }

  @Post('password-recovery')
  async getPasswordRecoveryToken() {}

  @Post('new-password')
  async setNewPassword() {}

  @SkipThrottle()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async getNewRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshTokens(req.cookies.refreshToken);
      res.cookie('refreshToken', refreshToken.get(), {
        httpOnly: true,
        secure: true,
      });
      return accessToken.getModel();
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginInputModel,
    @Req() req: Request,
  ) {
    const sessionInputModel: SessionInputModel = {
      deviceTitle: req.header('user-agent')?.split(' ')[1] || 'unknown',
      ip: req.ip || 'unknown',
    };

    const { accessToken, refreshToken } = await this.authService.loginUser(
      loginDto,
      sessionInputModel,
    );
    res.cookie('refreshToken', refreshToken.get(), {
      httpOnly: true,
      secure: true,
    });
    return accessToken.getModel();
  }

  @SkipThrottle()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    try {
      await this.authService.logout(req.cookies.refreshToken);
      return;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
