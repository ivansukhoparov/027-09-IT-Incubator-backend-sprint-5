import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { DevicesService } from '../application/devices.service';
import { DevicesQueryRepository } from '../infrastructure/devices.query.repository';

class SessionsQueryRepository {}

@Controller('security')
export class DevicesController {
  constructor(
    protected sessionsQueryRepository: DevicesQueryRepository,
    protected sessionsService: DevicesService,
  ) {}

  @Get('devices')
  async getAllActiveSessions(@Req() req: Request) {
    try {
      return await this.sessionsQueryRepository.getSessionsByUserId(req.cookies.refreshToken);
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateAllActiveSessions(@Req() req: Request) {
    await this.sessionsService.terminateAllSessions(req.cookies.refreshToken);
    return;
  }

  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateSession(@Param('id') id: string, @Req() req: Request) {
    const interlayerModel = await this.sessionsService.terminateSession(id, req.cookies.refreshToken);
    if (!interlayerModel.hasError()) return;
    if (interlayerModel.code === 401) throw new UnauthorizedException();
    if (interlayerModel.code === 404) throw new NotFoundException();
    if (interlayerModel.code === 403) throw new ForbiddenException();
  }
}
