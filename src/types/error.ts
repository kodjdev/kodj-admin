export type ApiErrorResponse = {
    data?: ApiErrorData;
    message?: string;
    statusCode?: number;
};

type ApiErrorData = {
    message?: string;
    [key: string]: any;
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
        (typeof (error as any).response === 'object' || typeof (error as any).message === 'string')
    );
}
