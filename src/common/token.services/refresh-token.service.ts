import { appSettings } from '../../settings/app.settings';
import { JwtPayload } from 'jsonwebtoken';
import { BaseToken } from '../../base/base.classes/base.token';
import { RefreshTokenDecodedDto } from './types/refresh.token';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshToken extends BaseToken<RefreshTokenDecodedDto> {
  constructor() {
    super(appSettings.api.JWT_SECRET_KEY, appSettings.api.REFRESH_TOKEN_EXPIRATION_TIME);
  }

  tokenMapper(decodedToken: JwtPayload): RefreshTokenDecodedDto {
    return {
      userId: decodedToken.userId,
      deviceId: decodedToken.deviceId,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    };
  }

  tokenModelMapper(token: string): any {
    return { accessToken: token };
  }
}
