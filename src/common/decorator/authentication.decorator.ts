import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guard/authentication.guard';

export function authentication() {
    return applyDecorators(
        UseGuards(AuthGuard),
    );
}