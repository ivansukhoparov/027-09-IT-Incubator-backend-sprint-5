import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

export class InterlayerNotice<D = null> {
  public data: D | null = null;
  public extension: { key: string; msg: string } | null = null;
  public code: number = 0;

  constructor(data: D | null = null, code: number = 0) {
    this.data = data;
    this.code = code;
  }

  public addData(data: D) {
    this.data = data;
  }

  public addError(message: string, key: string, code: number) {
    this.extension = { key: '', msg: '' };
    this.extension.key = key;
    this.extension.msg = message;
    this.code = code;
  }

  public hasError() {
    return this.code !== 0;
  }
}

export const ERRORS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  EMAIL_SEND_ERROR: 1001,
  ALREADY_CONFIRMED: 1002,
  INVALID_TOKEN: 1003,
  DATA_BASE_ERROR: 1004,
};

export const interlayerNoticeHandler = (interlayerNotice: InterlayerNotice<any>) => {
  if (interlayerNotice.hasError()) {
    if (interlayerNotice.code === ERRORS_CODES.UNAUTHORIZED) {
      throw new HttpException('Bad login or password', interlayerNotice.code);
    } else if (interlayerNotice.code === ERRORS_CODES.BAD_REQUEST) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: interlayerNotice.extension.msg,
            field: interlayerNotice.extension.key,
          },
        ],
      });
    } else if (interlayerNotice.code >= 1000) {
      throw new HttpException('Bad login or password', HttpStatus.BAD_GATEWAY);
    }
  } else {
    return;
  }
};
