export type ApiResponse<T> = {
    message: string;
    data: T;
    statusCode: number;
};

export type User = {
    id: number;
    providerId?: string;
    name?: string;
    username: string;
    email: string;
    phone?: string;
    bio?: string;
    oauthId?: string;
    oauthProvider?: 'GOOGLE';
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    imageName?: string;
    region?: string;
    createdAt: string;
};

export type PaginationParams = {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
};
