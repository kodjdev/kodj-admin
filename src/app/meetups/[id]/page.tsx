'use client';

import MeetupForm from '@/components/meetups/MeetupForm';

export default function EditMeetupPage({ params }: { params: { id: string } }) {
    return <MeetupForm meetupId={params.id} />;
}
