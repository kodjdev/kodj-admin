import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsService } from '@/services/api/newsService';
import { News } from '@/types/news';
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
    color: ${themeColors.colors.neutral.gray900};
    font-size: ${themeColors.typography.headings.desktop.h3.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h3.fontWeight};
    margin: 0;
`;

const StatusBadge = styled.span<{ type: string }>`
    padding: ${themeColors.spacing.xs} ${themeColors.spacing.sm};
    border-radius: ${themeColors.cardBorder.sm};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: 500;
    background-color: ${(props) => {
        switch (props.type) {
            case 'TECH':
                return themeColors.colors.primary.light + '20';
            case 'BUSINESS':
                return themeColors.colors.secondary.light + '20';
            default:
                return themeColors.colors.neutral.gray200;
        }
    }};
    color: ${(props) => {
        switch (props.type) {
            case 'TECH':
                return themeColors.colors.primary.dark;
            case 'BUSINESS':
                return themeColors.colors.secondary.dark;
            default:
                return themeColors.colors.neutral.gray700;
        }
    }};
`;

export default function NewsList() {
    const router = useRouter();
    const { getNews, deleteNews, loading, error } = useNewsService();
    const [newsList, setNewsList] = useState<News[]>([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await getNews();
            setNewsList(response.data);
        } catch (err) {
            console.error('Failed to fetch news:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                await deleteNews(id);
                await fetchNews();
            } catch (err) {
                console.error('Failed to delete news:', err);
            }
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/news/${id}`);
    };

    const handleCreate = () => {
        router.push('/news/new');
    };

    return (
        <>
            <HeaderContainer>
                <PageTitle>News Management</PageTitle>
                <Button onClick={handleCreate} variant="primary">
                    Add News
                </Button>
            </HeaderContainer>

            <Card>
                <TableContainer>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Title</Th>
                                <Th>Type</Th>
                                <Th>Author</Th>
                                <Th>Created At</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {newsList.map((news) => (
                                <Tr key={news.id}>
                                    <Td>{news.title}</Td>
                                    <Td>
                                        <StatusBadge type={news.type}>{news.type}</StatusBadge>
                                    </Td>
                                    <Td>{news.user.username}</Td>
                                    <Td>{new Date(news.createdAt).toLocaleDateString()}</Td>
                                    <Td>
                                        <ActionButtons>
                                            <Button size="sm" variant="secondary" onClick={() => handleEdit(news.id)}>
                                                Edit
                                            </Button>
                                            <Button size="sm" variant="error" onClick={() => handleDelete(news.id)}>
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
