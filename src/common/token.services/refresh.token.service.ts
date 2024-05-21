import { appSettings } from '../../settings/app.settings';
import { JwtPayload } from 'jsonwebtoken';
import { BaseToken } from '../../base/base.classes/base.token';
import {
  RefreshTokenDecodedDto,
  RefreshTokenPayloadDto,
} from './types/refresh.token';
import {
  createTokenStatusesKeysType,
  tokenServiceCommands,
} from './utils/common';

export class RefreshTokenService extends BaseToken<
  RefreshTokenPayloadDto,
  RefreshTokenDecodedDto
> {
  constructor(
    status: createTokenStatusesKeysType = tokenServiceCommands.empty,
    payload: RefreshTokenPayloadDto | string | null = null,
  ) {
    super(
      status,
      payload,
      appSettings.api.JWT_SECRET_KEY,
      appSettings.api.REFRESH_TOKEN_EXPIRATION_TIME,
    );
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
