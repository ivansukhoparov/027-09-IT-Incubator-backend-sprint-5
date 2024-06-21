import { JwtPayload } from 'jsonwebtoken';

export type AccessTokenDecodedDto = JwtPayload & {
  userId: string;
};
