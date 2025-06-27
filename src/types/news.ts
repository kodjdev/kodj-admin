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
