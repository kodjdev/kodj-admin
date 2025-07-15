import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Meetup } from '@/types/meetup';
import { useMeetupService } from '@/services/api/meetupService';
import MeetupList from '@/components/meetups/MeetupList';

export default function MeetupsPage() {
    const router = useRouter();
    const { getMeetups, deleteMeetup } = useMeetupService();

    const [upcomingMeetups, setUpcomingMeetups] = useState<Meetup[]>([]);
    const [pastMeetups, setPastMeetups] = useState<Meetup[]>([]);

    const [loadingUpcoming, setLoadingUpcoming] = useState(true);
    const [loadingPast, setLoadingPast] = useState(true);
    const [errorUpcoming, setErrorUpcoming] = useState<string | null>(null);
    const [errorPast, setErrorPast] = useState<string | null>(null);

    const hasFetched = useRef(false);

    useEffect(() => {
        fetchMeetups();
    }, []);

    const fetchMeetups = async () => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        setLoadingUpcoming(true);
        setLoadingPast(true);
        setErrorUpcoming(null);
        setErrorPast(null);

        const upcomingPromise = getMeetups({ type: 'upcoming', page: 0, size: 50 });
        const pastPromise = getMeetups({ type: 'past', page: 0, size: 50 });

        try {
            const [upcomingResult, pastResult] = await Promise.allSettled([upcomingPromise, pastPromise]);

            if (upcomingResult.status === 'fulfilled') {
                if (upcomingResult.value.statusCode === 200) {
                    setUpcomingMeetups(upcomingResult.value.data?.data.content || []);
                } else {
                    setErrorUpcoming(upcomingResult.value.message || 'Unknown error');
                }
            } else {
                setErrorUpcoming(upcomingResult.reason?.message || 'Unknown error');
            }
            setLoadingUpcoming(false);

            if (pastResult.status === 'fulfilled') {
                if (pastResult.value.statusCode === 200) {
                    setPastMeetups(pastResult.value.data?.data.content || []);
                } else {
                    setErrorPast(pastResult.value.message || 'Unknown error');
                }
            } else {
                setErrorPast(pastResult.reason?.message || 'Unknown error');
            }
            setLoadingPast(false);
        } catch (err) {
            setErrorUpcoming('A critical error occurred.');
            setErrorPast('A critical error occurred.');
            setLoadingUpcoming(false);
            setLoadingPast(false);
            console.error('Failed to fetch meetups:', err);
        }
    };

    const handleDelete = async (id: number, type: 'upcoming' | 'past') => {
        if (window.confirm('Are you sure you want to delete this meetup?')) {
            try {
                await deleteMeetup(id);
                hasFetched.current = false;
                await fetchMeetups();
                console.log(`${type} meetup with  ${id} deleted successfully.`);
            } catch (err) {
                console.error('Failed to delete meetup:', err);
            }
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/meetups/${id}`);
    };

    const handleCreate = () => {
        router.push('/meetups/new');
    };

    return (
        <MeetupList
            upcomingMeetups={upcomingMeetups}
            pastMeetups={pastMeetups}
            loadingUpcoming={loadingUpcoming}
            loadingPast={loadingPast}
            errorUpcoming={errorUpcoming}
            errorPast={errorPast}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCreate={handleCreate}
        />
    );
}
