'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/common/Table';
import { Meetup } from '@/types/meetup';

type MeetupListProps = {
    upcomingMeetups: Meetup[];
    pastMeetups: Meetup[];
    loadingUpcoming: boolean;
    loadingPast: boolean;
    errorUpcoming: string | null;
    errorPast: string | null;
    onDelete: (id: number, type: 'upcoming' | 'past') => Promise<void>;
    onEdit: (id: number) => void;
    onCreate: () => void;
};

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
    color: ${themeColors.colors.neutral.white};
    font-size: ${themeColors.typography.headings.desktop.h3.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h3.fontWeight};
    margin: 0;
`;

const SectionTitle = styled.h2`
    margin-top: ${themeColors.spacing.xl};
    margin-bottom: ${themeColors.spacing.md};
    font-size: ${themeColors.typography.headings.desktop.h4.fontSize}px;
    color: ${themeColors.colors.neutral.white};
`;

const TableCard = styled.div`
    border: 1px solid ${themeColors.colors.neutral.gray700};
    border-radius: ${themeColors.cardBorder.lg};
    overflow: hidden;
    margin-bottom: ${themeColors.spacing.xl};
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

const ErrorMessage = styled.p`
    color: ${themeColors.colors.error.main};
    margin-top: ${themeColors.spacing.md};
    margin-bottom: ${themeColors.spacing.md};
    text-align: center;
`;

const LoadingMessage = styled.p`
    color: ${themeColors.colors.neutral.gray300};
    margin-top: ${themeColors.spacing.md};
    margin-bottom: ${themeColors.spacing.md};
    text-align: center;
`;

const NoMeetupsMessage = styled.p`
    color: ${themeColors.colors.neutral.gray400};
    margin-top: ${themeColors.spacing.md};
    margin-bottom: ${themeColors.spacing.md};
    text-align: center;
`;

const MeetupTableSection: React.FC<{
    title: string;
    meetups: Meetup[];
    loading: boolean;
    error: string | null;
    onDelete: (id: number) => Promise<void>;
    onEdit: (id: number) => void;
    meetupType: 'upcoming' | 'past';
}> = ({ title, meetups, loading, error, onDelete, onEdit, meetupType }) => (
    <>
        <SectionTitle>{title}</SectionTitle>
        <TableCard>
            {loading && <LoadingMessage>Loading {title.toLowerCase()}...</LoadingMessage>}
            {error && (
                <ErrorMessage>
                    Error fetching {title.toLowerCase()}: {error}
                </ErrorMessage>
            )}
            {!loading && !error && meetups.length === 0 && (
                <NoMeetupsMessage>No {title.toLowerCase()} found.</NoMeetupsMessage>
            )}

            {!loading && !error && meetups.length > 0 && (
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
                                        <ActionButton size="sm" variant="secondary" onClick={() => onEdit(meetup.id)}>
                                            Manage
                                        </ActionButton>
                                        <ActionButton size="sm" variant="error" onClick={() => onDelete(meetup.id)}>
                                            Delete
                                        </ActionButton>
                                    </ActionButtons>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </TableCard>
    </>
);

export default function MeetupList({
    upcomingMeetups,
    pastMeetups,
    loadingUpcoming,
    loadingPast,
    errorUpcoming,
    errorPast,
    onDelete,
    onEdit,
    onCreate,
}: MeetupListProps) {
    return (
        <Container>
            <HeaderContainer>
                <PageTitle>Meetup Management</PageTitle>
                <CreateButton onClick={onCreate}>Create Meetup</CreateButton>
            </HeaderContainer>

            <MeetupTableSection
                title="Upcoming Meetups"
                meetups={upcomingMeetups}
                loading={loadingUpcoming}
                error={errorUpcoming}
                onDelete={(id) => onDelete(id, 'upcoming')}
                onEdit={onEdit}
                meetupType="upcoming"
            />

            <MeetupTableSection
                title="Past Meetups"
                meetups={pastMeetups}
                loading={loadingPast}
                error={errorPast}
                onDelete={(id) => onDelete(id, 'past')}
                onEdit={onEdit}
                meetupType="past"
            />
        </Container>
    );
}
