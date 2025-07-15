import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useNewsService } from '@/services/api/newsService';
import NewsList from '@/components/news/NewsList';
import { News } from '@/types/news';
import { message } from 'antd';

export default function NewsPage() {
    const router = useRouter();
    const { getNews, deleteNews } = useNewsService();
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const hasFetched = useRef(false);

    const fetchNews = async () => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        try {
            setLoading(true);
            setError(null);
            const response = await getNews();

            if (response.statusCode === 200 && response.data) {
                messageApi.success('News loaded successfully');
                const newsArray = Array.isArray(response.data.content) ? response.data.content : [];
                setNewsList(newsArray.flat());
            } else {
                throw new Error('Failed to fetch news');
            }
        } catch (err) {
            console.error('Failed to fetch news:', err);
            setError('Failed to load news');
            setNewsList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                const response = await deleteNews(id);
                if (response.statusCode !== 200) {
                    messageApi.error('Failed to delete news');
                }
                messageApi.success('News deleted successfully');
                await fetchNews();
            } catch (err) {
                console.error('Failed to delete news:', err);
                messageApi.error('Failed to delete news');
                setError('Failed to delete news');
            }
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/news/${id}`);
    };

    const handleCreate = () => {
        router.push('/news/new');
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <>
            {contextHolder}
            <NewsList
                newsList={newsList}
                loading={loading}
                error={error}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onCreate={handleCreate}
                onRefresh={fetchNews}
            />
        </>
    );
}
