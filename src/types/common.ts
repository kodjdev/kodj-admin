export type ApiResponse<T> = {
    message: string;
    data: T;
    statusCode: number;
    error?: boolean;
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
    oauthProvider?: 'GOOGLE' | 'FACEBOOK' | 'LOCAL' | 'GITHUB' | 'LINKEDIN';
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    imageName?: string;
    region?: string;
    createdAt: string;
    category?: string;
    role: 'user' | 'admin' | 'speaker';
};

export type UserDetails = {
    data: User;
};

export type PaginationParams = {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
};
