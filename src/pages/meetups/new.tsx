'use client';

import { useRouter } from 'next/navigation';
import MeetupForm from '@/components/meetups/MeetupForm';
import { useMeetupService } from '@/services/api/meetupService';
import { Meetup, MeetupFormData } from '@/types/meetup';
import { message } from 'antd';
import { useStatusHandler } from '@/hooks/useStatusCode';

export default function NewMeetupPage() {
    const router = useRouter();
    const { createMeetup } = useMeetupService();
    const [messageApi, contextHolder] = message.useMessage();
    const { handleAsyncOperation } = useStatusHandler(messageApi);

    const handleCreate = async (meetupData: Omit<Meetup, 'id' | 'availableSeats'>) => {
        await handleAsyncOperation(
            async () => {
                const submitData: MeetupFormData = {
                    ...meetupData,
                    imageName: '',
                    imageURL: '',
                    speakers: [],
                    keynoteSessions: [],
                };
                const response = await createMeetup(submitData);
                if (response.statusCode !== 201) {
                    throw new Error(response.message || 'Failed to create meetup');
                }
                return response;
            },
            {
                loadingMessage: 'Creating new meetup...',
                successMessage: 'Meetup created successfully! Redirecting...',
                errorMessage: 'Failed to create meetup',
                onSuccess: () => {
                    setTimeout(() => router.push('/meetups'), 1500);
                },
            },
        );
    };

    return (
        <>
            {contextHolder}
            <MeetupForm onSubmit={handleCreate} />
        </>
    );
}
