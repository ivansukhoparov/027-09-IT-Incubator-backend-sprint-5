import { Module } from '@nestjs/common';
import { AuthController } from './auth/api/auth.controller';
import { DevicesController } from './devices/api/devices.controller';
import { DevicesService } from './devices/application/devices.service';
import { DevicesRepository } from './devices/infrastructure/devices.repository';
import { DevicesQueryRepository } from './devices/infrastructure/devices.query.repository';
import { AuthService } from './auth/application/auth.service';
import { RefreshTokenRepository } from './auth/infrastructure/refresh.token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/infrastructure/users.schema';
import {
  DevicesSchema,
  Session,
} from './devices/infrastructure/devices.schema';
import {
  RefreshTokenBlackList,
  RefreshTokenBlackListSchema,
} from './auth/infrastructure/refresh.token.schema';
import { EmailMessagesManager } from '../../common/email/email.messages.manager';
import { EmailService } from '../../common/email/email.service';
import { NodemailerAdapter } from '../../common/adapters/nodemailer.adaper';
import { JwtTokenAdapter } from '../../common/adapters/jwt.token.adapter';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: RefreshTokenBlackList.name,
        schema: RefreshTokenBlackListSchema,
      },
      {
        name: Session.name,
        schema: DevicesSchema,
      },
    ]),
  ],
  controllers: [AuthController, DevicesController],
  providers: [
    AuthService,
    DevicesService,
    DevicesRepository,
    DevicesQueryRepository,
    RefreshTokenRepository,
    EmailMessagesManager,
    EmailService,
    NodemailerAdapter,
    JwtTokenAdapter,
  ],
  exports: [],
})
export class SecurityModule {}
