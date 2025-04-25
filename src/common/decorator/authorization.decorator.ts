import { Reflector } from '@nestjs/core';
export const authorization = Reflector.createDecorator<string[]>();
