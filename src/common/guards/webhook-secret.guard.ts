import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';

@Injectable()
export class WebhookSecretGuard implements CanActivate {
  private readonly logger = new Logger(WebhookSecretGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token =
      (request.headers['token'] as string | undefined) ??
      (request.query['token'] as string | undefined);
    const secret = this.configService.get<string>('UAZAPI_WEBHOOK_SECRET')!;

    if (!token) {
      this.logger.warn('Webhook request missing token');
      throw new UnauthorizedException('Missing token');
    }

    try {
      const tokenBuf = Buffer.from(token);
      const secretBuf = Buffer.from(secret);

      if (tokenBuf.length !== secretBuf.length) {
        throw new UnauthorizedException('Invalid token');
      }

      if (!timingSafeEqual(tokenBuf, secretBuf)) {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
