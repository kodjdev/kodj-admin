export type ApiErrorResponse = {
    data?: ApiErrorData;
    message?: string;
};

type ApiErrorData = {
    message?: string;
    [key: string]: any;
};

export class ApiError extends Error {
    response?: ApiErrorResponse;

    constructor(message: string, response?: ApiErrorResponse) {
        super(message);
        this.name = 'ApiError';
        this.response = response;
    }
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError && 'response' in error;
}
