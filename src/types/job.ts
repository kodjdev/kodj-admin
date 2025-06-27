import { User } from './common';

export type JobPost = {
    id: number;
    user: User;
    category: string;
    title: string;
    content: string;
    companyName: string;
    requiredExperience: string;
    technologies?: string;
    jobOfferStatus: 'OPEN' | 'CLOSED';
    jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
    jobBenefits?: string;
    remote: boolean;
    placeOfWork?: string;
    salaryRange?: string;
    contactPhone?: string;
    contactEmail?: string;
    twitterProfile?: string;
    linkedinProfile?: string;
    facebookProfile?: string;
    instagramProfile?: string;
    createdAt: string;
    imageName?: string;
    imageURL?: string;
};

export type JobFormData = {
    title: string;
    category?: string;
    content?: string;
    companyName: string;
    requiredExperience: string;
    technologies?: string;
    jobOfferStatus?: 'OPEN' | 'CLOSED';
    jobType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
    jobBenefits?: string;
    remote?: boolean;
    placeOfWork?: string;
    salaryRange?: string;
    contactPhone?: string;
    contactEmail?: string;
    twitterProfile?: string;
    linkedinProfile?: string;
    facebookProfile?: string;
    instagramProfile?: string;
    image?: File;
};
