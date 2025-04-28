export interface ApiResponse<T> {
    status: boolean;
    message: string;
    errors?: Array<{ field?: string; message: string }>;
    data?: T | null;
}