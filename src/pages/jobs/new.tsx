import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useJobService } from '@/services/api/jobService';
import { JobFormData } from '@/types/job';
import JobForm from '@/components/jobs/JobForm';
import { message } from 'antd';

export default function NewJobsPage() {
    const router = useRouter();
    const { createJobPost } = useJobService();
    const isSubmitting = useRef(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: JobFormData) => {
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        try {
            setLoading(true);
            await createJobPost(formData);
            messageApi.success('Job post created successfully');
            router.push('/jobs');
        } catch (err) {
            console.error('Failed to create job post:', err);
            messageApi.error('Failed to create job post');
        } finally {
            setLoading(false);
            isSubmitting.current = false;
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <>
            {contextHolder}
            <JobForm onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} mode="create" />
        </>
    );
}
