import { JwtPayload } from 'jsonwebtoken';

export interface IToken<Payload, Decoded> {
  create(payload: Payload): void;

  get(): string;

  set(token: string): void;

  verify(): boolean;

  decode(): Decoded;
}
