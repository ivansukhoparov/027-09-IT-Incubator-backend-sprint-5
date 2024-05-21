import { IsOptionalString } from '../../../../../infrastructure/decorators/validate/is.optional.string';
import { IsOptionalEmail } from '../../../../../infrastructure/decorators/validate/is.optional.email';

export class LoginInputModel {
  @IsOptionalString()
  loginOrEmail: string;

  @IsOptionalString()
  password: string;
}

export class UserEmailDto {
  @IsOptionalEmail()
  email: string;
}
