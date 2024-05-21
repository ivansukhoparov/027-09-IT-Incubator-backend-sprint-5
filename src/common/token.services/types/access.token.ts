import { JwtPayload } from 'jsonwebtoken';

export type AccessTokenPayloadDto = { userId: string };
export type AccessTokenDecodedDto = JwtPayload & {
  userId: string;
};
