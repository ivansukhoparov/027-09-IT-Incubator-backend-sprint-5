import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DevicesRepository } from '../infrastructure/devices.repository';
import uuid4 from 'uuid4';
import { AccessTokenService } from '../../../../common/token.services/access.token.service';
import { RefreshTokenService } from '../../../../common/token.services/refresh.token.service';
import { UserDocument } from '../../../users/infrastructure/users.schema';
import { InterlayerNotice } from '../../../../base/models/interlayer.notice';
import {
  SessionInputModel,
  SessionModel,
  SessionUpdateModel,
} from '../api/models/session.input.models';

@Injectable()
export class DevicesService {
  constructor(protected sessionsRepository: DevicesRepository) {}

  async createSession(
    sessionInputModel: SessionInputModel,
    user: UserDocument,
  ) {
    const deviceId = uuid4();
    const accessToken = new AccessTokenService('create', {
      userId: user.id,
    });
    const refreshToken = new RefreshTokenService('create', {
      userId: user.id,
      deviceId: deviceId,
    });

    const sessionModel: SessionModel = {
      userId: user.id,
      deviceId: deviceId,
      deviceTitle: sessionInputModel.deviceTitle,
      ip: sessionInputModel.ip,
      lastActiveDate: refreshToken.decode().iat,
      refreshToken: {
        createdAt: refreshToken.decode().iat,
        expiredAt: refreshToken.decode().exp,
      },
    };

    await this.sessionsRepository.createNewSession(sessionModel);
    return { accessToken, refreshToken };
  }

  async updateSession(UserId: string, deviceId: string) {
    const accessToken = new AccessTokenService('create', { userId: UserId });
    const refreshToken = new RefreshTokenService('create', {
      userId: UserId,
      deviceId: deviceId,
    });

    const sessionUpdateModel: SessionUpdateModel = {
      lastActiveDate: refreshToken.decode().iat,
      refreshToken: {
        createdAt: refreshToken.decode().iat,
        expiredAt: refreshToken.decode().exp,
      },
    };

    await this.sessionsRepository.updateExistSession(
      deviceId,
      sessionUpdateModel,
    );
    return { accessToken, refreshToken };
  }

  async terminateSession(deviceId: string, refreshTokenValue: string) {
    const refreshToken = new RefreshTokenService('set', refreshTokenValue);

    if (!refreshToken.verify()) return new InterlayerNotice(null, 401);

    const currentUserId = refreshToken.decode().userId;
    const interlayerModel =
      await this.sessionsRepository.getSessionByDeviceId(deviceId);

    if (!interlayerModel.hasError()) {
      if (currentUserId !== interlayerModel.data.userId)
        return new InterlayerNotice(null, 403);
    } else {
      return interlayerModel;
    }

    await this.sessionsRepository.deleteSessionById(deviceId);
    return new InterlayerNotice(null, 0);
  }

  async terminateAllSessions(refreshTokenValue: string) {
    const refreshToken = new RefreshTokenService('set', refreshTokenValue);
    if (!refreshToken.verify()) throw new UnauthorizedException();

    const currentUserId = refreshToken.decode().userId;
    const currentSessionDeviceId = refreshToken.decode().deviceId;

    await this.sessionsRepository.deleteSessionsExpectCurrent(
      currentUserId,
      currentSessionDeviceId,
    );
    return;
  }
}
