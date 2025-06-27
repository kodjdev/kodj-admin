import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

export const Card = styled.div`
    background-color: 
    border: 1px solid ${themeColors.cardBorder.color};
    border-radius: ${themeColors.cardBorder.lg};
    padding: ${themeColors.spacing.lg};
    box-shadow: ${themeColors.shadows.sm};
    transition: box-shadow ${themeColors.transitions.normal};

    &:hover {
        box-shadow: ${themeColors.shadows.md};
    }

    @media (max-width: ${themeColors.breakpoints.mobile}) {
        padding: ${themeColors.spacing.md};
    }
`;

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${themeColors.spacing.lg};
    padding-bottom: ${themeColors.spacing.md};
    border-bottom: 1px solid ${themeColors.cardBorder.color};
`;

export const CardTitle = styled.h3`
    color: ${themeColors.colors.neutral.white};
    font-size: ${themeColors.typography.headings.desktop.h5.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h5.fontWeight};
    margin: 0;

    @media (max-width: ${themeColors.breakpoints.mobile}) {
        font-size: ${themeColors.typography.headings.mobile.h5.fontSize}px;
    }
`;

export const CardContent = styled.div`
    color: ${themeColors.colors.neutral.gray700};
    line-height: ${themeColors.typography.body.regular.lineHeight};
`;

export const CardActions = styled.div`
    display: flex;
    gap: ${themeColors.spacing.sm};
    margin-top: ${themeColors.spacing.lg};
    padding-top: ${themeColors.spacing.md};
    border-top: 1px solid ${themeColors.cardBorder.color};

    @media (max-width: ${themeColors.breakpoints.mobile}) {
        flex-direction: column;
    }
`;
