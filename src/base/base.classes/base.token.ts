import { JwtTokenAdapter } from '../../common/adapters/jwt.token.adapter';
import { JwtPayload } from 'jsonwebtoken';
import {
  createTokenStatusesKeysType,
  tokenModel,
  tokenServiceCommands,
} from '../../common/token.services/utils/common';

export abstract class BaseToken<Payload, Decoded> {
  protected token: string;
  protected secretKey: string;
  protected expiresIn: string;
  protected tokenAdapter: JwtTokenAdapter;

  constructor(
    status: createTokenStatusesKeysType,
    payload: Payload | string | null,
    secretKey: string,
    expiresIn: string,
  ) {
    this.tokenAdapter = new JwtTokenAdapter();
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;

    if (payload && status === tokenServiceCommands.create) {
      this.create(payload as Payload);
    } else if (payload && status === tokenServiceCommands.set) {
      this.set(payload as string);
    }
  }

  get(): string {
    return this.token;
  }

  getModel(): tokenModel {
    return this.tokenModelMapper(this.token);
  }

  set(token: string): void {
    this.token = token;
  }

  verify(): boolean {
    return this.tokenAdapter.verify(this.token, this.secretKey);
  }

  create(payload: Payload): void {
    this.token = this.tokenAdapter.create(
      payload,
      { expiresIn: this.expiresIn },
      this.secretKey,
    );
  }

  decode(): Decoded | null {
    try {
      const decodedToken: JwtPayload = this.tokenAdapter.decode(this.token);
      return this.tokenMapper(decodedToken);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  abstract tokenMapper(decodedToken: JwtPayload): Decoded;
  abstract tokenModelMapper(token: string): tokenModel;
}
