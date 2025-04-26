// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { IJwtPayload } from 'src/modules/auth/interface/auth.interface';

export const User = createParamDecorator<unknown, IJwtPayload>(
    (data: unknown, ctx: ExecutionContext): IJwtPayload => {
        // Now Request.user is known to be IJwtPayload
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.user;
    },
);
