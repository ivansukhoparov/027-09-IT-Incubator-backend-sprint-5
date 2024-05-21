import { JwtPayload } from 'jsonwebtoken';

export type RefreshTokenPayloadDto = { userId: string; deviceId: string };
export type RefreshTokenDecodedDto = JwtPayload & {
  userId: string;
  deviceId: string;
};
