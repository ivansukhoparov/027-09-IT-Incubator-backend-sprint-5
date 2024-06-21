import { JwtPayload } from 'jsonwebtoken';

export type ConfirmationCodeDecoded = JwtPayload & {
  email: string;
};
