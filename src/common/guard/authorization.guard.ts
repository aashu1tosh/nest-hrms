import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Message } from 'src/constant/message';
import { Authorization } from '../decorator/authorization.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndMerge(Authorization, [
            context.getClass(),
            context.getHandler(),
        ]);
        if (requiredRoles.length === 0) return true; //if no roles are specified then pass through the guard
        const { user } = context.switchToHttp().getRequest<Request>();

        if (!requiredRoles.some((role) => user.role?.includes(role))) new ForbiddenException(Message.notPermitted);
        return true;
    }
}
