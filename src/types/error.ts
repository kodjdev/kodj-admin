export type ApiErrorResponse = {
    data?: ApiErrorData;
    message?: string;
    statusCode?: number;
    error?: boolean;
};

type ApiErrorData = {
    message?: string;
    [key: string]: unknown;
};

export type ApiError = {
    response?: {
        statusCode: number;
        data: {
            message?: string;
        };
    };
    message?: string;
};

export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        ('response' in error || 'message' in error) &&
        (((error as Partial<ApiError>).response !== undefined &&
            typeof (error as Partial<ApiError>).response === 'object') ||
            ((error as Partial<ApiError>).message !== undefined &&
                typeof (error as Partial<ApiError>).message === 'string'))
    );
}
