import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_MESSAGE_KEY } from '../decorator/api-response.decorator';
import { ApiResponse } from '../interface/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {

    constructor(private reflector: Reflector) { }

    // Modified interceptor that reads metadata
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        const apiMessage = this.reflector.get<string>(
            API_MESSAGE_KEY,
            context.getHandler(),
        ) || 'Success';

        return next.handle().pipe(
            map((data: T) => ({
                status: true,
                message: apiMessage,
                data: data,
            })),
        );
    }
}