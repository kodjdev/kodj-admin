import { useRouter } from 'next/navigation';
import MeetupForm from '@/components/meetups/MeetupForm';
import { useMeetupService } from '@/services/api/meetupService';
import { MeetupFormData } from '@/types/meetup';

export default function NewMeetupPage() {
    const router = useRouter();
    const { createMeetup } = useMeetupService();

    const handleCreate = async (formData: MeetupFormData, imageFile?: File | null) => {
        try {
            const submitData = {
                ...formData,
                image: imageFile ?? undefined,
            };
            await createMeetup(submitData);
            router.push('/meetups');
        } catch (err) {
            console.error('Failed to create meetup:', err);
        }
    };

    return <MeetupForm onSubmit={handleCreate} />;
}
