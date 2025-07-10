import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import MeetupList from '@/components/meetups/MeetupList';
import { useMeetupService } from '@/services/api/meetupService';
import { Meetup } from '@/types/meetup';

export default function MeetupsPage() {
    const router = useRouter();
    const { getMeetups, deleteMeetup } = useMeetupService();
    const [meetups, setMeetups] = useState<Meetup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        fetchMeetups();
    }, []);

    const fetchMeetups = async () => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        try {
            setLoading(true);
            const response = await getMeetups();
            setMeetups(response.data.data.content || []);
        } catch (err) {
            setError('Failed to fetch meetups');
            console.error('Failed to fetch meetups:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this meetup?')) {
            try {
                await deleteMeetup(id);
                await fetchMeetups();
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
            meetups={meetups}
            loading={loading}
            error={error}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCreate={handleCreate}
        />
    );
}
