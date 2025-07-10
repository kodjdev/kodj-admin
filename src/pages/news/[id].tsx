import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useNewsService } from '@/services/api/newsService';
import NewsForm from '@/components/news/NewsForm';
import { NewsFormData } from '@/types/news';
import { message } from 'antd';

export default function EditNewsPage() {
    const router = useRouter();
    const { id } = router.query;
    const { getNewsById, updateNews } = useNewsService();

    const [initialData, setInitialData] = useState<NewsFormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchNewsDetails = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            const response = await getNewsById(Number(id));
            console.log('Fetched news details:', response);

            if (response.statusCode === 200 && response.data) {
                const news = response.data;
                setInitialData({
                    id: news.id,
                    userId: news.id,
                    title: news.title,
                    content: news.content,
                    type: news.type,
                    contactPhone: news.contactPhone || '',
                    contactEmail: news.contactEmail || '',
                    twitterProfile: news.twitterProfile || '',
                    linkedinProfile: news.linkedinProfile || '',
                    facebookProfile: news.facebookProfile || '',
                    instagramHandle: news.instagramHandle || '',
                });
            } else {
                throw new Error('Failed to fetch news details');
            }
        } catch (err) {
            console.error('Failed to fetch news details:', err);
            setError('Failed to load news details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (formData: NewsFormData) => {
        if (!id) return;

        try {
            setUpdating(true);
            setError(null);

            const response = await updateNews(Number(id), formData);

            if (response.statusCode === 200) {
                messageApi.success('News updated successfully');
                router.push('/news');
            } else {
                throw new Error('Failed to update news');
            }
        } catch (err) {
            console.error('Failed to update news:', err);
            if (err instanceof Error) {
                messageApi.error(err.message);
            } else {
                messageApi.error('An unexpected error occurred');
            }
            setError('Failed to update news');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        router.push('/news');
    };

    useEffect(() => {
        if (router.isReady) {
            fetchNewsDetails();
        }
    }, [router.isReady, id]);

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                }}
            >
                Loading news details...
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    background: '#ff4444',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center',
                }}
            >
                {error}
                <button onClick={fetchNewsDetails} style={{ marginLeft: '12px' }}>
                    Retry
                </button>
            </div>
        );
    }

    if (!initialData) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding: '40px',
                }}
            >
                News not found
            </div>
        );
    }

    return (
        <NewsForm
            initialData={initialData}
            loading={updating}
            error={error}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            isEdit={true}
        />
    );
}
