import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessToken } from '../../common/token.services/access-token.service';

export const AUTH_METHODS = {
  base: 'Basic',
  bearer: 'Bearer',
};

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.header('authorization')?.split(' '); // Получаем значение поля в заголовке
      const authMethod = authHeader[0]; // получаем метод из заголовка
      const authInput = authHeader[1]; // получаем значение для авторизации из заголовка
      const auth = btoa(`${'admin'}:${'qwerty'}`); // кодируем наши логин и пароль в basic64

      if (authInput === auth && authMethod === AUTH_METHODS.base) {
        return true;
      } else {
        throw new HttpException('Bad login or password', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('Bad login or password', HttpStatus.UNAUTHORIZED);
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.header('authorization')?.split(' '); // Получаем значение поля в заголовке
      const authMethod = authHeader[0]; // получаем метод из заголовка
      const token = new AccessToken();

      if (token.verify(authHeader[1]) && authMethod === AUTH_METHODS.bearer) {
        return true;
      } else {
        throw new HttpException('Bad login or password', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('Bad login or password', HttpStatus.UNAUTHORIZED);
    }
  }
}
