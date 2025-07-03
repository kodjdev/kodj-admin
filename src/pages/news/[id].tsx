import NewsForm from '@/components/news/NewsForm';

export default function EditNewsPage({ params }: { params: { id: string } }) {
    if (!params.id) {
        return <NewsForm />;
    }

    return <NewsForm newsId={params.id} />;
}
