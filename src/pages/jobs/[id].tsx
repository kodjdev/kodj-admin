import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useJobService } from '@/services/api/jobService';
import { JobFormData, JobPost } from '@/types/job';
import JobForm from '@/components/jobs/JobForm';
import { message } from 'antd';

export default function JobsIdPage() {
    const router = useRouter();
    const { id } = router.query;
    const { getJobPostById, updateJobPost } = useJobService();
    const hasFetched = useRef(false);
    const isSubmitting = useRef(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<JobPost | null>(null);

    const fetchJob = async () => {
        if (hasFetched.current || !id) return;
        hasFetched.current = true;

        try {
            setLoading(true);
            const response = await getJobPostById(Number(id));

            setInitialData(response.data);
        } catch (err) {
            console.error('Failed to fetch job:', err);
            messageApi.error('Failed to fetch job details');
            router.push('/jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData: JobFormData) => {
        if (isSubmitting.current || !id) return;
        isSubmitting.current = true;

        try {
            setSubmitting(true);
            await updateJobPost(Number(id), formData);
            messageApi.success('Job post updated successfully');
            router.push('/jobs');
        } catch (err) {
            console.error('Failed to update job post:', err);
            messageApi.error('Failed to update job post');
        } finally {
            setSubmitting(false);
            isSubmitting.current = false;
        }
    };

    const handleCancel = () => {
        router.back();
    };

    useEffect(() => {
        fetchJob();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {contextHolder}
            <JobForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={submitting}
                mode="edit"
            />
        </>
    );
}
