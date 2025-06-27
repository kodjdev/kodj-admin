import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

export const TableContainer = styled.div`
    overflow-x: auto;
    border: 1px solid ${themeColors.cardBorder.color};
    border-radius: ${themeColors.cardBorder.lg};
    background-color: ${themeColors.colors.neutral.white};
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const Thead = styled.thead`
    background-color: ${themeColors.colors.neutral.gray50};
    border-bottom: 1px solid ${themeColors.cardBorder.color};
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
    border-bottom: 1px solid ${themeColors.cardBorder.color};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${themeColors.colors.neutral.gray50};
    }
`;

export const Th = styled.th`
    padding: ${themeColors.spacing.md};
    text-align: left;
    font-weight: 600;
    color: ${themeColors.colors.neutral.gray700};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

export const Td = styled.td`
    padding: ${themeColors.spacing.md};
    color: ${themeColors.colors.neutral.gray900};
    font-size: ${themeColors.typography.body.regular.fontSize}px;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: ${themeColors.spacing.xs};
`;
