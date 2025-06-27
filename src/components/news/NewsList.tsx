'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsService } from '@/services/api/newsService';
import { News } from '@/types/news';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.xl};
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${themeColors.spacing.lg};
`;

const PageTitle = styled.h1`
    color: #ffffff;
    font-size: ${themeColors.typography.headings.desktop.h3.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h3.fontWeight};
    margin: 0;
`;

const TableCard = styled.div`
    background-color: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: ${themeColors.cardBorder.lg};
    overflow: hidden;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const Thead = styled.thead`
    background-color: #0a0a0a;
`;

const Th = styled.th`
    padding: ${themeColors.spacing.md} ${themeColors.spacing.lg};
    text-align: left;
    font-weight: 600;
    color: #b3b3b3;
    font-size: ${themeColors.typography.body.small.fontSize}px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
    border-bottom: 1px solid #2a2a2a;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: rgba(255, 255, 255, 0.02);
    }
`;

const Td = styled.td`
    padding: ${themeColors.spacing.md} ${themeColors.spacing.lg};
    color: #ffffff;
    font-size: ${themeColors.typography.body.regular.fontSize}px;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: ${themeColors.spacing.sm};
`;

const ActionButton = styled(Button)`
    padding: ${themeColors.spacing.xs} ${themeColors.spacing.md};
    font-size: ${themeColors.typography.body.small.fontSize}px;
`;

const AddButton = styled(Button)`
    background-color: #4f46e5;
    color: white;
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.lg};

    &:hover {
        background-color: #4338ca;
    }
`;

const TypeBadge = styled.span<{ type: string }>`
    padding: ${themeColors.spacing.xs} ${themeColors.spacing.sm};
    border-radius: ${themeColors.cardBorder.sm};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: 500;
    background-color: ${(props) => {
        switch (props.type) {
            case 'TECH':
                return 'rgba(79, 70, 229, 0.2)';
            case 'BUSINESS':
                return 'rgba(124, 58, 237, 0.2)';
            default:
                return 'rgba(107, 114, 128, 0.2)';
        }
    }};
    color: ${(props) => {
        switch (props.type) {
            case 'TECH':
                return '#818cf8';
            case 'BUSINESS':
                return '#a78bfa';
            default:
                return '#9ca3af';
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
        <Container>
            <HeaderContainer>
                <PageTitle>News Management</PageTitle>
                <AddButton onClick={handleCreate}>Add News</AddButton>
            </HeaderContainer>

            <TableCard>
                <Table>
                    <Thead>
                        <tr>
                            <Th>TITLE</Th>
                            <Th>TYPE</Th>
                            <Th>AUTHOR</Th>
                            <Th>CREATED AT</Th>
                            <Th>ACTIONS</Th>
                        </tr>
                    </Thead>
                    <Tbody>
                        {newsList.map((news) => (
                            <Tr key={news.id}>
                                <Td>{news.title}</Td>
                                <Td>
                                    <TypeBadge type={news.type}>{news.type}</TypeBadge>
                                </Td>
                                <Td>{news.user.username}</Td>
                                <Td>{new Date(news.createdAt).toLocaleDateString()}</Td>
                                <Td>
                                    <ActionButtons>
                                        <ActionButton size="sm" variant="secondary" onClick={() => handleEdit(news.id)}>
                                            Edit
                                        </ActionButton>
                                        <ActionButton size="sm" variant="error" onClick={() => handleDelete(news.id)}>
                                            Delete
                                        </ActionButton>
                                    </ActionButtons>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableCard>
        </Container>
    );
}
