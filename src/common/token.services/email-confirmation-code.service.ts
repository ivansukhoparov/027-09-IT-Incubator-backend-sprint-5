import { appSettings } from '../../settings/app.settings';
import { JwtPayload } from 'jsonwebtoken';
import { BaseToken } from '../../base/base.classes/base.token';
import { ConfirmationCodeDecoded } from './types/email.confirmation.code';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailConfirmationCode extends BaseToken<ConfirmationCodeDecoded> {
  constructor() {
    super(appSettings.api.JWT_SECRET_KEY, appSettings.api.EMAIL_CONFIRMATION_EXPIRATION_TIME);
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
