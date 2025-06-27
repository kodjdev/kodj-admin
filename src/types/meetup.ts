export type Meetup = {
    id: number;
    title: string;
    description: string;
    parking: boolean;
    location: string;
    maxSeats: number;
    availableSeats: number;
    provided: string;
    meetupDate: string;
    organizerId: number;
    startTime: string;
    endTime: string;
    imageName?: string;
    imageURL?: string;
};

export type MeetupFormData = {
    title: string;
    description: string;
    parking: boolean;
    location: string;
    maxSeats: number;
    provided: string;
    meetupDate: string;
    startTime: string;
    endTime: string;
    image?: File;
};

export type Speaker = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    organization: string;
    position: string;
    bio: string;
    shortDescription: string;
    experience: string;
    topic: string;
    linkedinUrl?: string;
    imageName?: string;
    imageURL?: string;
    category: string;
    createdAt: string;
};

export type SpeakerFormData = {
    userId: number;
    categoryId: number;
    organization: string;
    position: string;
    bio: string;
    shortDescription: string;
    experience: string;
    topic: string;
    linkedinUrl?: string;
    image?: File;
};

export type Note = {
    id: number;
    status: 'ACTIVE' | 'INACTIVE';
    title: string;
    description: string;
    createdAt: string;
};

export type NoteFormData = {
    title: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
};

export type Keynote = {
    id: number;
    speaker: Speaker;
    subject: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    imageName?: string;
    imageURL?: string;
};

export type KeynoteFormData = {
    speakerId: number;
    subject: string;
    startTime: string;
    endTime: string;
    file?: File;
};
