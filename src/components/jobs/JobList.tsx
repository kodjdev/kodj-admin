import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJobService } from '@/services/api/jobService';
import { JobPost } from '@/types/job';
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
    color: ${themeColors.colors.neutral.white};
    font-size: ${themeColors.typography.headings.desktop.h3.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h3.fontWeight};
    margin: 0;
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

export default function JobList() {
    const router = useRouter();
    const { getJobPosts, deleteJobPost, loading } = useJobService();
    const [jobs, setJobs] = useState<JobPost[]>([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await getJobPosts();
            setJobs(response.data);
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this job post?')) {
            try {
                await deleteJobPost(id);
                await fetchJobs();
            } catch (err) {
                console.error('Failed to delete job:', err);
            }
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/jobs/${id}`);
    };

    const handleCreate = () => {
        router.push('/jobs/new');
    };

    return (
        <>
            <HeaderContainer>
                <PageTitle>Job Posts Management</PageTitle>
                <Button onClick={handleCreate} variant="primary">
                    Create Job Post
                </Button>
            </HeaderContainer>

            <Card>
                <TableContainer>
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
                            {jobs.map((job) => (
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
                                            <Button size="sm" variant="error" onClick={() => handleDelete(job.id)}>
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
