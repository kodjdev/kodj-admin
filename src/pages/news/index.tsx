import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useNewsService } from '@/services/api/newsService';
import NewsList from '@/components/news/NewsList';
import { News, PaginatedResponse } from '@/types/news';

export default function NewsPage() {
    const router = useRouter();
    const { getNews, deleteNews } = useNewsService();
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getNews();

            if (response.statusCode === 200 && response.data) {
                console.log('Fetched news:', response.data);
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
                await deleteNews(id);
                await fetchNews();
            } catch (err) {
                console.error('Failed to delete news:', err);
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
        <NewsList
            newsList={newsList}
            loading={loading}
            error={error}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCreate={handleCreate}
            onRefresh={fetchNews}
        />
    );
}
