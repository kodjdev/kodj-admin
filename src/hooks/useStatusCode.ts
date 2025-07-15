import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { STATUS_CODE_MESSAGES } from '@/constant/statusCodes';

export type StatusMessage = {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    statusCode?: number;
    timestamp: Date;
    id: string;
};

export type StatusCodeConfig = {
    showToast?: boolean;
    autoHide?: boolean;
    hideAfter?: number;
    customMessage?: string;
    onSuccess?: () => void;
    onError?: (error: { statusCode?: number; message?: string; originalError?: unknown }) => void;
};

export type MessageApi = {
    success: (content: React.ReactNode | string, duration?: number, onClose?: () => void) => void;
    error: (content: React.ReactNode | string, duration?: number, onClose?: () => void) => void;
    warning: (content: React.ReactNode | string, duration?: number, onClose?: () => void) => void;
    info: (content: React.ReactNode | string, duration?: number, onClose?: () => void) => void;
    loading: (content: React.ReactNode | string, duration?: number, onClose?: () => void) => void;
    open: (config: {
        content: React.ReactNode | string;
        type: 'success' | 'error' | 'warning' | 'info' | 'loading';
    }) => void;
};

export const useStatusHandler = (messageApi?: MessageApi) => {
    const [loading, setLoading] = useState(false);

    const handleStatus = useCallback(
        (statusCode: number, config: StatusCodeConfig = {}) => {
            const { customMessage, onSuccess, onError } = config;

            const statusMessage = STATUS_CODE_MESSAGES[statusCode as keyof typeof STATUS_CODE_MESSAGES];
            const defaultMessage: StatusMessage = statusMessage
                ? {
                      ...statusMessage,
                      timestamp: new Date(),
                      id: String(Date.now()),
                  }
                : {
                      type: 'error',
                      title: 'Unknown Error',
                      message: `Unexpected status code: ${statusCode}`,
                      timestamp: new Date(),
                      id: String(Date.now()),
                  };

            const messageContent = customMessage || defaultMessage.message;

            if (messageApi) {
                switch (defaultMessage.type) {
                    case 'success':
                        messageApi.success(messageContent);
                        break;
                    case 'error':
                        messageApi.error(messageContent);
                        break;
                    case 'warning':
                        messageApi.warning(messageContent);
                        break;
                    case 'info':
                        messageApi.info(messageContent);
                        break;
                    default:
                        messageApi.info(messageContent);
                }
            }

            if (statusCode >= 200 && statusCode < 300) {
                onSuccess?.();
            } else {
                onError?.({ statusCode, message: messageContent });
            }
        },
        [messageApi],
    );

    const handleError = useCallback(
        (error: unknown, config: StatusCodeConfig = {}) => {
            let statusCode = 500;
            let errorMessage = 'An unexpected error occurred';

            if (error instanceof AxiosError) {
                statusCode = error.response?.status || 500;
                errorMessage =
                    error.response?.data?.message ||
                    error.response?.data?.data ||
                    error.message ||
                    'Network error occurred';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            return handleStatus(statusCode, {
                ...config,
                customMessage: config.customMessage || errorMessage,
            });
        },
        [handleStatus],
    );

    const handleAsyncOperation = useCallback(
        async <T>(
            operation: () => Promise<T>,
            config: StatusCodeConfig & {
                loadingMessage?: string;
                successMessage?: string;
                errorMessage?: string;
            } = {},
        ): Promise<T | null> => {
            const { loadingMessage = 'Processing...', successMessage, errorMessage, ...statusConfig } = config;

            try {
                setLoading(true);

                if (loadingMessage && messageApi) {
                    messageApi.loading(loadingMessage);
                }

                const result = await operation();

                if (successMessage) {
                    handleStatus(200, {
                        ...statusConfig,
                        customMessage: successMessage,
                    });
                }

                return result;
            } catch (error) {
                handleError(error, {
                    ...statusConfig,
                    customMessage: errorMessage,
                });
                return null;
            } finally {
                setLoading(false);
            }
        },
        [handleStatus, handleError, messageApi],
    );

    return {
        loading,
        handleStatus,
        handleError,
        handleAsyncOperation,
    };
};
