export const STATUS_CODE_MESSAGES = {
    200: { type: 'success' as const, title: 'Success', message: 'Request processed successfully' },
    400: { type: 'error' as const, title: 'Bad Request', message: 'Invalid or malformed request' },
    401: { type: 'error' as const, title: 'Unauthorized', message: 'Missing or invalid authentication token' },
    403: { type: 'error' as const, title: 'Forbidden', message: 'Access denied due to insufficient permissions' },
    404: { type: 'error' as const, title: 'Not Found', message: 'Requested resource not found' },
    500: { type: 'error' as const, title: 'Internal Server Error', message: 'Unexpected server error occurred' },
};
