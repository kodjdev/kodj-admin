import { User } from './common';

export type News = {
    id: number;
    user: User;
    title: string;
    content: string;
    type: 'TECH' | 'BUSINESS' | 'GENERAL';
    contactPhone?: string;
    contactEmail?: string;
    twitterProfile?: string;
    linkedinProfile?: string;
    facebookProfile?: string;
    instagramHandle?: string;
    imageName?: string;
    imageURL?: string;
    createdAt: string;
};

export type PaginatedResponse<T> = {
    content: T[];
    pageAble: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
};

export type NewsFormData = {
    id?: number;
    userId?: number;
    title: string;
    content: string;
    type: 'TECH' | 'BUSINESS' | 'GENERAL';
    contactPhone?: string;
    contactEmail?: string;
    twitterProfile?: string;
    linkedinProfile?: string;
    facebookProfile?: string;
    instagramHandle?: string;
    imageFile?: File;
};
