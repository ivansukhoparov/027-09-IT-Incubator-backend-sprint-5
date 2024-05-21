import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './devices.schema';
import { securityMapper } from '../types/mapper';
import { RefreshTokenService } from '../../../../common/token.services/refresh.token.service';
import { SecurityDevicesOutput } from '../types/output';

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async getSessionsByUserId(
    refreshTokenValue: string,
  ): Promise<SecurityDevicesOutput[]> {
    const refreshToken = new RefreshTokenService('set', refreshTokenValue);
    if (!refreshToken.verify()) throw new UnauthorizedException();

    const userId = refreshToken.decode().userId;

    const sessions = await this.sessionModel.find({ userId: userId }).lean();
    return sessions.map(securityMapper);
  }

  // async getSessionByDeviceId(deviceId: string) {
  //   const session =  await securityCollection.findOne({deviceId:deviceId});
  //   if (!session){
  //     return null;
  //   }
  //   return securityMapper(session);
  // }
}
