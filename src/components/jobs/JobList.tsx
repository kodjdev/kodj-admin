import React from 'react';
import { useRouter } from 'next/navigation';
import { JobPost } from '@/types/job';
import { Table, Thead, Tbody, Tr, Th, Td, ActionButtons } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';
import { RefreshCwIcon } from 'lucide-react';

type JobListProps = {
    jobs: JobPost[];
    loading: boolean;
    onDelete: (id: number) => Promise<void>;
    onRefresh: () => Promise<void>;
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

const TableCard = styled.div`
    background-color: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: ${themeColors.cardBorder.lg};
    overflow: hidden;
`;

const JobTypeBadge = styled.span<{ type: string }>`
    padding: ${themeColors.spacing.xs} ${themeColors.spacing.sm};
    border-radius: ${themeColors.cardBorder.sm};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: 500;
    background-color: ${(props) => {
        switch (props.type) {
            case 'FULL_TIME':
                return themeColors.colors.primary.light + '20';
            case 'PART_TIME':
                return themeColors.colors.secondary.light + '20';
            case 'CONTRACT':
                return themeColors.colors.warning.light + '20';
            case 'INTERNSHIP':
                return themeColors.colors.success.light + '20';
            default:
                return themeColors.colors.neutral.gray200;
        }
    }};
    color: ${(props) => {
        switch (props.type) {
            case 'FULL_TIME':
                return themeColors.colors.primary.dark;
            case 'PART_TIME':
                return themeColors.colors.secondary.dark;
            case 'CONTRACT':
                return themeColors.colors.warning.dark;
            case 'INTERNSHIP':
                return themeColors.colors.success.dark;
            default:
                return themeColors.colors.neutral.gray700;
        }
    }};
`;

const StatusBadge = styled.span<{ status: string }>`
    padding: ${themeColors.spacing.xs} ${themeColors.spacing.sm};
    border-radius: ${themeColors.cardBorder.sm};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: 500;
    background-color: ${(props) =>
        props.status === 'OPEN' ? themeColors.colors.success.light + '20' : themeColors.colors.neutral.gray200};
    color: ${(props) =>
        props.status === 'OPEN' ? themeColors.colors.success.dark : themeColors.colors.neutral.gray700};
`;

const LoadingOverlay = styled.div`
    padding: ${themeColors.spacing.xl};
    text-align: center;
    color: ${themeColors.colors.neutral.gray400};
`;
// components/jobs/JobList.tsx
export default function JobList({ jobs, loading, onDelete, onRefresh }: JobListProps) {
    const router = useRouter();

    // Add safety check to ensure jobs is always an array
    const safeJobs = Array.isArray(jobs) ? jobs : [];

    const handleEdit = (id: number) => {
        router.push(`/jobs/${id}`);
    };

    const handleCreate = () => {
        router.push('/jobs/new');
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this job post?')) {
            await onDelete(id);
        }
    };

    if (loading) {
        return (
            <Container>
                <HeaderContainer>
                    <PageTitle>Jobs Management</PageTitle>
                    <Button onClick={handleCreate}>Create a post</Button>
                </HeaderContainer>
                <TableCard>
                    <LoadingOverlay>Loading jobs...</LoadingOverlay>
                </TableCard>
            </Container>
        );
    }

    return (
        <Container>
            <HeaderContainer>
                <PageTitle>Jobs Management</PageTitle>
                <div style={{ display: 'flex', gap: themeColors.spacing.md }}>
                    <Button variant="transparent" onClick={onRefresh}>
                        <RefreshCwIcon size={16} />
                    </Button>
                    <Button onClick={handleCreate}>Create a post</Button>
                </div>
            </HeaderContainer>
            <TableCard>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Company</Th>
                            <Th>Type</Th>
                            <Th>Status</Th>
                            <Th>Remote</Th>
                            <Th>Posted</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {safeJobs.length === 0 ? (
                            <Tr>
                                <Td colSpan={7} style={{ textAlign: 'center', padding: themeColors.spacing.xl }}>
                                    No jobs found. Create your first job post!
                                </Td>
                            </Tr>
                        ) : (
                            safeJobs.map((job) => (
                                <Tr key={job.id}>
                                    <Td>{job.title}</Td>
                                    <Td>{job.companyName}</Td>
                                    <Td>
                                        <JobTypeBadge type={job.jobType}>{job.jobType.replace('_', ' ')}</JobTypeBadge>
                                    </Td>
                                    <Td>
                                        <StatusBadge status={job.jobOfferStatus}>{job.jobOfferStatus}</StatusBadge>
                                    </Td>
                                    <Td>{job.remote ? 'Yes' : 'No'}</Td>
                                    <Td>{new Date(job.createdAt).toLocaleDateString()}</Td>
                                    <Td>
                                        <ActionButtons>
                                            <Button size="sm" variant="secondary" onClick={() => handleEdit(job.id)}>
                                                Edit
                                            </Button>
                                            <Button size="sm" variant="error" onClick={() => handleDeleteClick(job.id)}>
                                                Delete
                                            </Button>
                                        </ActionButtons>
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </Tbody>
                </Table>
            </TableCard>
        </Container>
    );
}
