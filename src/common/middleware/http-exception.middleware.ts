import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { ApiResponse } from '../interface/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors: Array<{ field?: string; message: string }> = [];

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            // Type guard to ensure exceptionResponse is an object
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                // Define a proper interface for the exception response
                interface ExceptionResponseType {
                    message?: string | string[];
                    error?: string;
                    statusCode?: number;
                }

                // Type assertion with a defined interface
                const exceptionObj = exceptionResponse as ExceptionResponseType;

                if (exceptionObj.message) {
                    if (Array.isArray(exceptionObj.message)) {
                        // Use type assertion to ensure the correct type
                        errors = this.formatValidationErrors(exceptionObj.message);
                        message = 'Validation failed';
                    } else {
                        message = exceptionObj.message;
                    }
                } else if (exceptionObj.error) {
                    message = exceptionObj.error;
                }
            }
        } else if (exception instanceof Error) {
            // Log the actual error
            console.error(exception);

            message = 'Internal server error';
        }

        // Create standardized response
        const standardResponse: ApiResponse<null> = {
            status: false,
            message,
            errors: errors.length > 0 ? errors : undefined
        };

        response.status(statusCode).json(standardResponse);
    }

    private formatValidationErrors(validationErrors: string[] | ValidationError[]): Array<{ field?: string; message: string }> {
        // Handle string array errors
        if (validationErrors.length > 0 && typeof validationErrors[0] === 'string') {
            return validationErrors.map(errorMsg => ({ message: errorMsg as string }));
        }

        // Handle ValidationError objects
        const errors: Array<{ field?: string; message: string }> = [];

        (validationErrors as ValidationError[]).forEach(error => {
            if (error.constraints) {
                Object.values(error.constraints).forEach(constraint => {
                    errors.push({
                        field: error.property,
                        message: constraint
                    });
                });
            }
        });

        return errors;
    }
}