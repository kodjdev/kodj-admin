'use client';

import { useRouter } from 'next/router';
import MeetupForm from '@/components/meetups/MeetupForm';
import { useMeetupService } from '@/services/api/meetupService';
import { Meetup, MeetupFormData } from '@/types/meetup';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useStatusHandler } from '@/hooks/useStatusCode';

export default function EditMeetupPage() {
    const router = useRouter();
    const { id } = router.query;
    const { getMeetupDetails, updateMeetup, updateMeetupMedia } = useMeetupService();
    const [messageApi, contextHolder] = message.useMessage();
    const { handleAsyncOperation } = useStatusHandler(messageApi);

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<MeetupFormData | null>(null);

    useEffect(() => {
        if (!router.isReady || !id) return;

        const fetchDetails = async () => {
            const result = await handleAsyncOperation(
                async () => {
                    const response = await getMeetupDetails(Number(id));
                    if (response.statusCode !== 200 || !response.data.data) {
                        throw new Error('Failed to fetch meetup details');
                    }

                    const raw = response.data.data;
                    console.log('Fetched meetup details:', raw);

                    const mapped: MeetupFormData = {
                        title: raw.title,
                        description: raw.description,
                        parking: raw.parking,
                        location: raw.location,
                        maxSeats: raw.maxSeats,
                        provided: raw.provided,
                        meetupDate: raw.meetupDate,
                        startTime: raw.startTime,
                        endTime: raw.endTime,
                        imageName: raw.imageName ?? '',
                        imageURL: raw.imageURL ?? '',
                        speakers: raw.speakers ?? [],
                        keynoteSessions: raw.keynoteSessions ?? [],
                    };

                    return mapped;
                },
                {
                    loadingMessage: 'Loading meetup details...',
                    successMessage: 'Meetup details loaded successfully',
                    errorMessage: 'Failed to load meetup details',
                },
            );

            if (result) {
                setFormData(result);
            }
            setLoading(false);
        };
        fetchDetails();
    }, [router.isReady, id]);

    const handleUpdate = async (updatedData: Meetup) => {
        await handleAsyncOperation(
            async () => {
                const response = await updateMeetup(Number(id), updatedData);
                if (response.statusCode !== 200) {
                    throw new Error('Failed to update meetup');
                }
                return response;
            },
            {
                loadingMessage: 'Updating meetup...',
                successMessage: 'Meetup updated successfully! Redirecting...',
                errorMessage: 'Failed to update meetup',
                onSuccess: () => {
                    setTimeout(() => router.push('/meetups'), 1500);
                },
            },
        );
    };

    const handleImageUpdate = async (imageFile: File) => {
        await handleAsyncOperation(
            async () => {
                const response = await updateMeetupMedia(Number(id), imageFile);
                if (response.statusCode !== 200) {
                    throw new Error('Failed to update image');
                }
                return response;
            },
            {
                loadingMessage: 'Updating image...',
                successMessage: 'Image updated successfully!',
                errorMessage: 'Failed to update image',
            },
        );
    };

    if (loading) return <p>Loading...</p>;
    if (!formData) return <p>No data found for this meetup</p>;

    return (
        <>
            {contextHolder}
            <MeetupForm
                meetupId={String(id)}
                initialData={formData}
                onSubmit={handleUpdate}
                onImageUpdate={handleImageUpdate}
            />
        </>
    );
}
