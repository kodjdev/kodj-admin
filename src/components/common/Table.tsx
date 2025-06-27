import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

export const TableContainer = styled.div`
    overflow-x: auto;
    border: 1px solid #2a2a2a;
    border-radius: ${themeColors.cardBorder.lg};
    background-color: #1a1a1a;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const Thead = styled.thead`
    background-color: #2a2a2a;
    border-bottom: 1px solid #2a2a2a;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
    border-bottom: 1px solid #2a2a2a;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #2a2a2a;
    }
`;

export const Th = styled.th`
    padding: ${themeColors.spacing.md};
    text-align: left;
    font-weight: 600;
    color: #b3b3b3;
    font-size: ${themeColors.typography.body.small.fontSize}px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

export const Td = styled.td`
    padding: ${themeColors.spacing.md};
    color: #ffffff;
    font-size: ${themeColors.typography.body.regular.fontSize}px;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: ${themeColors.spacing.xs};
`;
