import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guard/authentication.guard';

export function Authentication() {
  return applyDecorators(UseGuards(AuthGuard));
}
