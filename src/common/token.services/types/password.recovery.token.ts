import { JwtPayload } from 'jsonwebtoken';

export type PasswordRecoveryTokenPayloadDto = { userId: string };
export type PasswordRecoveryTokenDecodedDto = JwtPayload & {
  userId: string;
};
