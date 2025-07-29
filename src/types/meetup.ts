type BaseMeetup = {
    id: number;
    title: string;
    description: string;
    parking: boolean;
    location: string;
    maxSeats: number;
    provided: string;
    meetupDate: string;
    startTime: string;
    endTime: string;
    availableSeats: number;
};

export type Meetup = BaseMeetup & {
    image?: string;
    imageName?: string;
    imageURL?: string;
};

export type MeetupResponse = BaseMeetup & {
    id: number;
    availableSeats: number;
    organizerId: number;
    imageName: string;
    imageURL: string;
};
export type MeetupPaginationParams = {
    page: number;
    size: number;
    type?: 'upcoming' | 'past';
};

export type MeetupDetails = {
    id: number;
    title: string;
    description: string;
    parking: boolean;
    location: string;
    maxSeats: number;
    availableSeats: number;
    provided: string;
    meetupDate: string;
    startTime: string;
    endTime: string;
    imageName?: string;
    imageURL?: string;
    speakers: Speaker[];
    keynoteSessions: Keynote[];
    meetupRegistrations: MeetupRegistration[];
    notes: Note[];
    reviews: Review[];
};

// export type MeetupDetailsResponse = {
//     data: MeetupDetails;
// };

export type MeetupRegistration = {
    id: number;
    firstName: string;
    lastName: string;
    avatarURL?: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    cancelled: boolean;
    attendanceReason?: string;
    expectation?: string;
    interestField?: string;
    createdAt: string;
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
    imageName: string;
    imageURL: string;
    speakers: Speaker[];
    keynoteSessions: Keynote[];
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

export type Review = {
    id: number;
    username: string;
    avatarURL?: string;
    description: string;
    createdAt: string;
    media: {
        id: number;
        url: string;
        name: string;
        mediaType: 'IMAGE' | 'VIDEO';
        createdAt: string;
    };
};
