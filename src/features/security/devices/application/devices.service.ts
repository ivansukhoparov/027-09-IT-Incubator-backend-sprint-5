import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DevicesRepository } from '../infrastructure/devices.repository';
import uuid4 from 'uuid4';
import { AccessToken } from '../../../../common/token.services/access-token.service';
import { RefreshToken } from '../../../../common/token.services/refresh-token.service';
import { UserDocument } from '../../../users/infrastructure/users.schema';
import { InterlayerNotice } from '../../../../base/models/interlayer.notice';
import { SessionInputModel, SessionModel, SessionUpdateModel } from '../api/models/session.input.models';
import { TokenPair } from '../../auth/types/output';

@Injectable()
export class DevicesService {
  constructor(
    protected sessionsRepository: DevicesRepository,
    protected readonly accessToken: AccessToken,
    protected readonly refreshToken: RefreshToken,
  ) {}

  async createSession(sessionInputModel: SessionInputModel, user: UserDocument) {
    const deviceId = uuid4();
    const accessToken = this.accessToken.create({
      userId: user.id,
    });
    const refreshToken = this.refreshToken.create({
      userId: user.id,
      deviceId: deviceId,
    });
    const refreshTokenPayload = this.refreshToken.decode(refreshToken);

    const sessionModel: SessionModel = {
      userId: user.id,
      deviceId: deviceId,
      deviceTitle: sessionInputModel.deviceTitle,
      ip: sessionInputModel.ip,
      lastActiveDate: refreshTokenPayload.iat,
      refreshToken: {
        createdAt: refreshTokenPayload.iat,
        expiredAt: refreshTokenPayload.exp,
      },
    };

    await this.sessionsRepository.createNewSession(sessionModel);
    return { accessToken, refreshToken };
  }

  async updateSession(UserId: string, deviceId: string): Promise<TokenPair> {
    const accessToken = this.accessToken.create({
      userId: UserId,
    });
    const refreshToken = this.refreshToken.create({
      userId: UserId,
      deviceId: deviceId,
    });
    const refreshTokenPayload = this.refreshToken.decode(refreshToken);

    const sessionUpdateModel: SessionUpdateModel = {
      lastActiveDate: refreshTokenPayload.iat,
      refreshToken: {
        createdAt: refreshTokenPayload.iat,
        expiredAt: refreshTokenPayload.exp,
      },
    };

    await this.sessionsRepository.updateExistSession(deviceId, sessionUpdateModel);
    return { accessToken, refreshToken };
  }

  async terminateSession(deviceId: string, refreshTokenValue: string) {
    const refreshTokenPayload = this.refreshToken.decode(refreshTokenValue);

    if (!refreshTokenPayload) return new InterlayerNotice(null, 401);

    const currentUserId = refreshTokenPayload.userId;
    const interlayerModel = await this.sessionsRepository.getSessionByDeviceId(deviceId);

    if (!interlayerModel.hasError()) {
      if (currentUserId !== interlayerModel.data.userId) return new InterlayerNotice(null, 403);
    } else {
      return interlayerModel;
    }

    await this.sessionsRepository.deleteSessionById(deviceId);
    return new InterlayerNotice(null, 0);
  }

  async terminateAllSessions(refreshTokenValue: string) {
    const refreshTokenPayload = this.refreshToken.decode(refreshTokenValue);
    if (!refreshTokenPayload) throw new UnauthorizedException();

    const currentUserId = refreshTokenPayload.userId;
    const currentSessionDeviceId = refreshTokenPayload.deviceId;

    await this.sessionsRepository.deleteSessionsExpectCurrent(currentUserId, currentSessionDeviceId);
    return;
  }
}
