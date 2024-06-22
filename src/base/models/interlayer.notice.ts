export class InterlayerNotice<D = null> {
  public data: D | null = null;
  public extension: { key: string; msg: string } | null = null;
  public code: number = 0;

  constructor(data: D | null = null, code: number = 0) {
    this.data = data;
    this.code = code;
  }

  addData(data: D) {
    this.data = data;
  }

  addError(message: string, key: string, code: number) {
    this.extension.key = key;
    this.extension.msg = message;
    this.code = code;
  }

  hasError() {
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
