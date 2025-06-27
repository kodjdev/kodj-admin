'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMeetupService } from '@/services/api/meetupService';
import { Meetup } from '@/types/meetup';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';
import { Table, Tbody, Td, Th, Thead, Tr } from '../common/Table';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.xl};
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${themeColors.spacing.lg};
`;

const PageTitle = styled.h1`
    color: #ffffff;
    font-size: ${themeColors.typography.headings.desktop.h3.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h3.fontWeight};
    margin: 0;
`;

const TableCard = styled.div`
    background-color: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: ${themeColors.cardBorder.lg};
    overflow: hidden;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: ${themeColors.spacing.sm};
`;

const ActionButton = styled(Button)`
    padding: ${themeColors.spacing.xs} ${themeColors.spacing.md};
    font-size: ${themeColors.typography.body.small.fontSize}px;
`;

const CreateButton = styled(Button)`
    background-color: #4f46e5;
    color: white;
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.lg};

    &:hover {
        background-color: #4338ca;
    }
`;

const AvailabilityBadge = styled.span<{ $available: boolean }>`
    padding: ${themeColors.spacing.xs} ${themeColors.spacing.sm};
    border-radius: ${themeColors.cardBorder.sm};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: 500;
    background-color: ${(props) => (props.$available ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)')};
    color: ${(props) => (props.$available ? '#10b981' : '#ef4444')};
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
        <Container>
            <HeaderContainer>
                <PageTitle>Meetup Management</PageTitle>
                <CreateButton onClick={handleCreate}>Create Meetup</CreateButton>
            </HeaderContainer>

            <TableCard>
                <Table>
                    <Thead>
                        <tr>
                            <Th>TITLE</Th>
                            <Th>DATE</Th>
                            <Th>LOCATION</Th>
                            <Th>SEATS</Th>
                            <Th>ACTIONS</Th>
                        </tr>
                    </Thead>
                    <Tbody>
                        {meetups.map((meetup) => (
                            <Tr key={meetup.id}>
                                <Td>{meetup.title}</Td>
                                <Td>{new Date(meetup.meetupDate).toLocaleDateString()}</Td>
                                <Td>{meetup.location}</Td>
                                <Td>
                                    <AvailabilityBadge $available={meetup.availableSeats > 0}>
                                        {meetup.availableSeats}/{meetup.maxSeats}
                                    </AvailabilityBadge>
                                </Td>
                                <Td>
                                    <ActionButtons>
                                        <ActionButton
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => handleEdit(meetup.id)}
                                        >
                                            Manage
                                        </ActionButton>
                                        <ActionButton size="sm" variant="error" onClick={() => handleDelete(meetup.id)}>
                                            Delete
                                        </ActionButton>
                                    </ActionButtons>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableCard>
        </Container>
    );
}
