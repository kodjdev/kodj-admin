import React, { useState, useEffect, useRef } from 'react';
import { useJobService } from '@/services/api/jobService';
import { JobPost } from '@/types/job';
import JobList from '@/components/jobs/JobList';
import { message } from 'antd';

export default function JobsPage() {
    const { getJobPosts, deleteJobPost } = useJobService();
    const hasFetched = useRef(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        try {
            setLoading(true);
            const response = await getJobPosts();

            const jobsData = response.data?.data.content || [];

            setJobs(jobsData);

            if (jobsData.length > 0) {
                messageApi.success('Jobs loaded successfully');
            }
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
            messageApi.error('Failed to fetch jobs');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteJobPost(id);
            messageApi.success('Job post deleted successfully');
            hasFetched.current = false;
            await fetchJobs();
        } catch (err) {
            messageApi.error('Failed to delete job post');
        }
    };

    const handleRefresh = async () => {
        hasFetched.current = false;
        await fetchJobs();
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <>
            {contextHolder}
            <JobList jobs={jobs} loading={loading} onDelete={handleDelete} onRefresh={handleRefresh} />
        </>
    );
}
