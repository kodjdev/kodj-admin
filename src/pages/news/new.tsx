import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useNewsService } from '@/services/api/newsService';
import NewsForm from '@/components/news/NewsForm';
import { NewsFormData } from '@/types/news';
import { message } from 'antd';

export default function NewNewsPage() {
    const router = useRouter();
    const { createNews } = useNewsService();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasFetched = useRef(false);

    const handleCreate = async (formData: NewsFormData) => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        try {
            setLoading(true);
            setError(null);

            const response = await createNews(formData);

            if (response.statusCode === 200 || response.statusCode === 201) {
                messageApi.success('News created successfully');
                router.push('/news');
            } else {
                throw new Error('Failed to create news');
            }
        } catch (err) {
            if (err instanceof Error) {
                messageApi.error(err.message);
            } else {
                messageApi.error('An unexpected error occurred');
            }
            console.error('Failed to create news:', err);
            setError('Failed to create news');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/news');
    };

    return (
        <>
            {contextHolder}
            <NewsForm loading={loading} error={error} onSubmit={handleCreate} onCancel={handleCancel} isEdit={false} />
        </>
    );
}
