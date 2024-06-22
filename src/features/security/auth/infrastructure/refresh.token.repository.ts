import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshTokenBlackList, RefreshTokenBlackListDocument } from './refresh.token.schema';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenBlackList.name)
    private refreshTokenBlackListModel: Model<RefreshTokenBlackList>,
  ) {}

  async addToBlackList(token: string) {
    try {
      await this.refreshTokenBlackListModel.create({ refreshToken: token });
      return true;
    } catch {
      throw new Error();
    }
  }

  async findInBlackList(token: string) {
    try {
      const isInBlackList: RefreshTokenBlackListDocument = await this.refreshTokenBlackListModel.findOne({
        refreshToken: token,
      });
      return !!isInBlackList;
    } catch {
      throw new Error();
    }
  }
}
