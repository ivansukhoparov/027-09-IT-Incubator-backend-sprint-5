import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessTokenService } from '../../common/token.services/access.token.service';
import { tokenServiceCommands } from '../../common/token.services/utils/common';

export const AUTH_METHODS = {
  base: 'Basic',
  bearer: 'Bearer',
};

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.header('authorization')?.split(' '); // Получаем значение поля в заголовке
      const authMethod = authHeader[0]; // получаем метод из заголовка
      const authInput = authHeader[1]; // получаем значение для авторизации из заголовка
      const auth = btoa(`${'admin'}:${'qwerty'}`); // кодируем наши логин и пароль в basic64

      if (authInput === auth && authMethod === AUTH_METHODS.base) {
        return true;
      } else {
        throw new HttpException(
          'Bad login or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch {
      throw new HttpException('Bad login or password', HttpStatus.UNAUTHORIZED);
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.header('authorization')?.split(' '); // Получаем значение поля в заголовке
      const authMethod = authHeader[0]; // получаем метод из заголовка
      const token = new AccessTokenService(
        tokenServiceCommands.set,
        authHeader[1],
      );

      if (token.verify() && authMethod === AUTH_METHODS.bearer) {
        return true;
      } else {
        throw new HttpException(
          'Bad login or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch {
      throw new HttpException('Bad login or password', HttpStatus.UNAUTHORIZED);
    }
  }
}
