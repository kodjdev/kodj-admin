export type PaginatedResponse<T> = {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    data: {
        content: T[];
    };
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
};
