import { JwtPayload } from 'jsonwebtoken';

export type ConfirmationCodePayload = { email: string };
export type ConfirmationCodeDecoded = JwtPayload & {
  email: string;
};
