import { appSettings } from '../../settings/app.settings';
import { JwtPayload } from 'jsonwebtoken';
import { BaseToken } from '../../base/base.classes/base.token';
import {
  AccessTokenDecodedDto,
  AccessTokenPayloadDto,
} from './types/access.token';
import {
  createTokenStatusesKeysType,
  tokenModel,
  tokenServiceCommands,
} from './utils/common';
import { ConfirmationCodePayload } from './types/email.confirmation.code';

export class AccessTokenService extends BaseToken<
  AccessTokenPayloadDto,
  AccessTokenDecodedDto
> {
  constructor(
    status: createTokenStatusesKeysType = tokenServiceCommands.empty,
    payload: AccessTokenPayloadDto | string | null = null,
  ) {
    super(
      status,
      payload,
      appSettings.api.JWT_SECRET_KEY,
      appSettings.api.ACCESS_TOKEN_EXPIRATION_TIME,
    );
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
