import { appSettings } from '../../settings/app.settings';
import { JwtPayload } from 'jsonwebtoken';
import { BaseToken } from '../../base/base.classes/base.token';
import { AccessTokenDecodedDto } from './types/access.token';
import { tokenModel } from './types/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessToken extends BaseToken<AccessTokenDecodedDto> {
  constructor() {
    super(appSettings.api.JWT_SECRET_KEY, appSettings.api.ACCESS_TOKEN_EXPIRATION_TIME);
  }

  tokenMapper(decodedToken: JwtPayload): AccessTokenDecodedDto {
    return {
      userId: decodedToken.userId,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    };
  }

  tokenModelMapper(token: string): tokenModel {
    return { accessToken: token };
  }
}
