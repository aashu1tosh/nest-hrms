
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { Message } from 'src/constant/message';
import { IJwtPayload } from 'src/modules/auth/interface/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException(Message.notAuthorized);
        }
        try {
            const payload = this.jwtService.verify<IJwtPayload>(token, {
                secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            });

            request.user = payload;
        } catch {
            throw new UnauthorizedException(Message.accessTokenExpired);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const tokens: { accessToken?: string; refreshToken?: string } = request.cookies;
        if (!tokens.accessToken && tokens.refreshToken)
            throw new UnauthorizedException('TOKEN_EXPIRED');
        return tokens.accessToken;
    }
}
