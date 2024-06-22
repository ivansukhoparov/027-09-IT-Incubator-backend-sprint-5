import { tokenModel } from '../../common/token.services/types/common';

import jwt, { JwtPayload } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
//
// @Injectable()
// export class JwtTokenAdapter {
//   create(payload: any, options: object, secretKey: string) {
//     return jwt.sign(payload, secretKey, options);
//   }
//
//   // verify(token: string, secretKey: string) {
//   //   try {
//   //     jwt.verify(token, secretKey);
//   //     return true;
//   //   } catch (err) {
//   //     return false;
//   //   }
//   // }
//
//   decode(token: string): JwtPayload {
//     return jwt.decode(token, { json: true });
//   }
// }
// : string | object | Buffer
export abstract class BaseToken<Decoded> {
  // protected token: string;
  protected secretKey: string;
  protected expiresIn: string;

  // protected tokenAdapter: JwtTokenAdapter;

  constructor(
    // status: createTokenStatusesKeysType,
    // payload: Payload | string | null,
    secretKey: string,
    expiresIn: string,
  ) {
    // this.tokenAdapter = new JwtTokenAdapter();
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;

    // if (payload && status === tokenServiceCommands.create) {
    //   this.create(payload as Payload);
    // } else if (payload && status === tokenServiceCommands.set) {
    //   this.set(payload as string);
    // }
  }

  // get(): string {
  //   return this.token;
  // }

  getModel(token: string): tokenModel {
    return this.tokenModelMapper(token);
  }

  // set(token: string): void {
  //   this.token = token;
  // }

  verify(token: string): boolean {
    try {
      jwt.verify(token, this.secretKey);
      return true;
    } catch (err) {
      return false;
    }
  }

  create(payload: string | object | Buffer) {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  // create(payload: Payload): void {
  //   this.token = this.tokenAdapter.create(
  //     payload,
  //     { expiresIn: this.expiresIn },
  //     this.secretKey,
  //   );
  // }

  decode(token: string): Decoded | null {
    try {
      jwt.verify(token, this.secretKey);
      const decodedToken: JwtPayload = jwt.decode(token, { json: true });
      return this.tokenMapper(decodedToken);
    } catch (err) {
      return null;
    }
  }

  abstract tokenMapper(decodedToken: JwtPayload): Decoded;

  abstract tokenModelMapper(token: string): tokenModel;
}
