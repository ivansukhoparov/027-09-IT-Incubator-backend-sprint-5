import { JwtPayload } from 'jsonwebtoken';

export type RefreshTokenDecodedDto = JwtPayload & {
  userId: string;
  deviceId: string;
};
