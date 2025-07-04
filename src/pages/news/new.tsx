import { useState } from 'react';
import { useRouter } from 'next/router';
import { useNewsService } from '@/services/api/newsService';
import NewsForm from '@/components/news/NewsForm';
import { NewsFormData } from '@/types/news';

export default function NewNewsPage() {
    const router = useRouter();
    const { createNews } = useNewsService();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (formData: NewsFormData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await createNews(formData);

            if (response.statusCode === 200 || response.statusCode === 201) {
                router.push('/news');
            } else {
                throw new Error('Failed to create news');
            }
        } catch (err) {
            console.error('Failed to create news:', err);
            setError('Failed to create news');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/news');
    };

    return <NewsForm loading={loading} error={error} onSubmit={handleCreate} onCancel={handleCancel} isEdit={false} />;
}
