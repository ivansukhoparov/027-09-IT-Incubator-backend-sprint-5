import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument } from './devices.schema';
import { Model } from 'mongoose';
import { InterlayerNotice } from '../../../../base/models/interlayer.notice';
import { SessionModel, SessionUpdateModel } from '../api/models/session.input.models';

@Injectable()
export class DevicesRepository {
  constructor(@InjectModel(Session.name) protected sessionsModel: Model<Session>) {}

  async createNewSession(sessionModel: SessionModel) {
    try {
      const session: SessionDocument = await this.sessionsModel.create(sessionModel);
      return session._id.toString();
    } catch {
      throw new Error();
    }
  }

  async updateExistSession(deviceId: string, updateModel: SessionUpdateModel) {
    try {
      const session: SessionDocument = await this.sessionsModel.findOne({
        deviceId: deviceId,
      });
      session.lastActiveDate = updateModel.lastActiveDate;
      session.refreshToken.expiredAt = updateModel.refreshToken.expiredAt;
      session.refreshToken.createdAt = updateModel.refreshToken.createdAt;
      await session.save();
    } catch {
      throw new Error();
    }
  }

  async deleteSessionById(deviceId: string) {
    try {
      const result = await this.sessionsModel.deleteOne({ deviceId: deviceId });
      if (result.deletedCount === 0) throw new NotFoundException();
      else return true;
    } catch {
      throw new NotFoundException();
    }
  }

  async getSessionByDeviceId(deviceId: string) {
    try {
      const session = await this.sessionsModel.findOne({ deviceId: deviceId });
      if (session) return new InterlayerNotice(session, 0);
      else return new InterlayerNotice(null, 404);
    } catch {
      return new InterlayerNotice(null, 500);
    }
  }

  async deleteSessionsExpectCurrent(userId: string, deviceId: string) {
    try {
      await this.sessionsModel.deleteMany({
        $and: [{ userId: userId }, { deviceId: { $not: { $eq: deviceId } } }],
      });
    } catch {
      throw new Error();
    }
  }
}
