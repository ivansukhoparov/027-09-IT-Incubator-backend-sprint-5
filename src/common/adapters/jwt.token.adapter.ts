import jwt, { JwtPayload } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenAdapter {
  create(payload: any, options: object, secretKey: string) {
    return jwt.sign(payload, secretKey, options);
  }

  verify(token: string, secretKey: string) {
    try {
      jwt.verify(token, secretKey);
      return true;
    } catch (err) {
      return false;
    }
  }

  decode(token: string): JwtPayload {
    return jwt.decode(token, { json: true });
  }
}
