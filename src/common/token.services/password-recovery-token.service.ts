import { Injectable } from '@nestjs/common';
import { appSettings } from '../../settings/app.settings';
import { JwtPayload } from 'jsonwebtoken';
import { BaseToken } from '../../base/base.classes/base.token';
import { PasswordRecoveryTokenDecodedDto } from './types/password.recovery.token';

@Injectable()
export class PasswordRecoveryToken extends BaseToken<PasswordRecoveryTokenDecodedDto> {
  constructor() {
    super(appSettings.api.JWT_SECRET_KEY, appSettings.api.RECOVERY_TOKEN_EXPIRATION_TIME);
  }

  tokenMapper(decodedToken: JwtPayload): PasswordRecoveryTokenDecodedDto {
    return {
      userId: decodedToken.userId,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    };
  }
  tokenModelMapper(token: string): any {
    return { accessToken: token };
  }
}
