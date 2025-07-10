import { useRouter } from 'next/navigation';
import MeetupForm from '@/components/meetups/MeetupForm';
import { useMeetupService } from '@/services/api/meetupService';
import { Meetup } from '@/types/meetup';
import { useRef } from 'react';

export default function NewMeetupPage() {
    const router = useRouter();
    const { createMeetup } = useMeetupService();
    const hasFetched = useRef(false);

    const handleCreate = async (meetup: Meetup, imageFile?: File | null) => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        try {
            const submitData = {
                ...meetup,
                image: imageFile ?? undefined,
                imageName: '',
                imageURL: '',
                speakers: [],
                keynoteSessions: [],
            };
            await createMeetup(submitData);
            router.push('/meetups');
        } catch (err) {
            console.error('Failed to create meetup:', err);
        }
    };

    return <MeetupForm onSubmit={handleCreate} />;
}
