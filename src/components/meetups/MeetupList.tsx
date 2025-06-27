import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMeetupService } from '@/services/api/meetupService';
import { Meetup } from '@/types/meetup';
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td, ActionButtons } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${themeColors.spacing.lg};
`;

const PageTitle = styled.h1`
    color: ${themeColors.colors.neutral.gray900};
    font-size: ${themeColors.typography.headings.desktop.h3.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h3.fontWeight};
    margin: 0;
`;

const AvailabilityBadge = styled.span<{ available: boolean }>`
    padding: ${themeColors.spacing.xs} ${themeColors.spacing.sm};
    border-radius: ${themeColors.cardBorder.sm};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: 500;
    background-color: ${(props) =>
        props.available ? themeColors.colors.success.light + '20' : themeColors.colors.error.light + '20'};
    color: ${(props) => (props.available ? themeColors.colors.success.dark : themeColors.colors.error.dark)};
`;

export default function MeetupList() {
    const router = useRouter();
    const { getMeetups, deleteMeetup, loading } = useMeetupService();
    const [meetups, setMeetups] = useState<Meetup[]>([]);

    useEffect(() => {
        fetchMeetups();
    }, []);

    const fetchMeetups = async () => {
        try {
            const response = await getMeetups();
            setMeetups(response.data);
        } catch (err) {
            console.error('Failed to fetch meetups:', err);
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
        <>
            <HeaderContainer>
                <PageTitle>Meetup Management</PageTitle>
                <Button onClick={handleCreate} variant="primary">
                    Create Meetup
                </Button>
            </HeaderContainer>

            <Card>
                <TableContainer>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Title</Th>
                                <Th>Date</Th>
                                <Th>Location</Th>
                                <Th>Seats</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {meetups.map((meetup) => (
                                <Tr key={meetup.id}>
                                    <Td>{meetup.title}</Td>
                                    <Td>{new Date(meetup.meetupDate).toLocaleDateString()}</Td>
                                    <Td>{meetup.location}</Td>
                                    <Td>
                                        <AvailabilityBadge available={meetup.availableSeats > 0}>
                                            {meetup.availableSeats}/{meetup.maxSeats}
                                        </AvailabilityBadge>
                                    </Td>
                                    <Td>
                                        <ActionButtons>
                                            <Button size="sm" variant="secondary" onClick={() => handleEdit(meetup.id)}>
                                                Manage
                                            </Button>
                                            <Button size="sm" variant="error" onClick={() => handleDelete(meetup.id)}>
                                                Delete
                                            </Button>
                                        </ActionButtons>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Card>
        </>
    );
}
