import React from 'react';
import { News } from '@/types/news';
import { Button } from '@/components/common/Button';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/common/Table';

type NewsListProps = {
    newsList: News[];
    loading: boolean;
    error: string | null;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
    onCreate: () => void;
    onRefresh?: () => void;
};

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

export default function NewsList({ newsList, loading, error, onDelete, onEdit, onCreate, onRefresh }: NewsListProps) {
    return (
        <Container>
            <HeaderContainer>
                <PageTitle>News Management</PageTitle>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {onRefresh && (
                        <AddButton variant="secondary" onClick={onRefresh} disabled={loading}>
                            {loading ? 'Loading...' : 'Refresh'}
                        </AddButton>
                    )}
                    <AddButton onClick={onCreate}>Add News</AddButton>
                </div>
            </HeaderContainer>

            {error && (
                <div
                    style={{
                        background: '#ff4444',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                    }}
                >
                    {error}
                    {onRefresh && (
                        <button onClick={onRefresh} style={{ marginLeft: '12px' }}>
                            Retry
                        </button>
                    )}
                </div>
            )}

            <TableCard>
                {loading ? (
                    <div
                        style={{
                            padding: '40px',
                            textAlign: 'center',
                            color: '#666',
                        }}
                    >
                        Loading news...
                    </div>
                ) : (
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
                            {newsList.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            textAlign: 'center',
                                            padding: '40px',
                                            color: '#666',
                                        }}
                                    >
                                        No news found
                                    </td>
                                </tr>
                            ) : (
                                newsList.map((news) => (
                                    <Tr key={news.id}>
                                        <Td>{news.title}</Td>
                                        <Td>
                                            <TypeBadge type={news.type}>{news.type}</TypeBadge>
                                        </Td>
                                        <Td>{news.user?.username || 'Unknown'}</Td>
                                        <Td>{new Date(news.createdAt).toLocaleDateString()}</Td>
                                        <Td>
                                            <ActionButtons>
                                                <ActionButton
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => onEdit(news.id)}
                                                >
                                                    Edit
                                                </ActionButton>
                                                <ActionButton
                                                    size="sm"
                                                    variant="error"
                                                    onClick={() => onDelete(news.id)}
                                                >
                                                    Delete
                                                </ActionButton>
                                            </ActionButtons>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                )}
            </TableCard>
        </Container>
    );
}
