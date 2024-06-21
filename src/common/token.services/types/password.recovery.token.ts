import { JwtPayload } from 'jsonwebtoken';

export type PasswordRecoveryTokenDecodedDto = JwtPayload & {
  userId: string;
};
