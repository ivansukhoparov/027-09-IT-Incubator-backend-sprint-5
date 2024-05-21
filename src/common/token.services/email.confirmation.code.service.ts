import { appSettings } from '../../settings/app.settings';
import { JwtPayload } from 'jsonwebtoken';
import { BaseToken } from '../../base/base.classes/base.token';
import {
  ConfirmationCodeDecoded,
  ConfirmationCodePayload,
} from './types/email.confirmation.code';
import {
  tokenServiceCommands,
  createTokenStatusesKeysType,
} from './utils/common';

export class EmailConfirmationCodeService extends BaseToken<
  ConfirmationCodePayload,
  ConfirmationCodeDecoded
> {
  constructor(
    status: createTokenStatusesKeysType = tokenServiceCommands.empty,
    payload: ConfirmationCodePayload | string | null = null,
  ) {
    super(
      status,
      payload,
      appSettings.api.JWT_SECRET_KEY,
      appSettings.api.EMAIL_CONFIRMATION_EXPIRATION_TIME,
    );
  }

  tokenMapper(decodedToken: JwtPayload): ConfirmationCodeDecoded {
    return {
      email: decodedToken.email,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    };
  }
  tokenModelMapper(token: string): any {
    return { accessToken: token };
  }
}
