import { Reflector } from '@nestjs/core';
export const Authorization = Reflector.createDecorator<string[]>();
