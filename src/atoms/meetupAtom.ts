import { atom } from 'recoil';
import { MeetupFormData } from '@/types/meetup';

export const upcomingEventDataAtom = atom<MeetupFormData | null>({
    key: 'upcomingEventDataAtom',
    default: null,
});
