import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { authorization } from '../decorator/authorization.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndMerge(authorization, [
            context.getClass(),
            context.getHandler(),
        ]);
        if (requiredRoles.length === 0) return true; //if no roles are specified then pass through the guard
        const { user } = context.switchToHttp().getRequest<Request>();
        return requiredRoles.some((role) => user.role?.includes(role));
    }
}
