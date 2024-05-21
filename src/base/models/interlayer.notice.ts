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
