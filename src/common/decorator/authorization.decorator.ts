import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { Role } from "src/constant/enum";
import { AuthGuard } from "../guard/authentication.guard";
import { AuthorizationGuard } from "../guard/authorization.guard";

export const ROLES_KEY = 'role';

export function Authorization(roles: Role[]) {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(AuthGuard, AuthorizationGuard),
    );
}