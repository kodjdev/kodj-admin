import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'transparent';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
};

export const Button = styled.button<ButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: ${themeColors.cardBorder.md};
    font-weight: 500;
    cursor: pointer;
    transition: all ${themeColors.transitions.normal};
    width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

    ${(props) => {
        switch (props.variant) {
            case 'secondary':
                return `
                    background-color: #2a2a2a;
                    color: #ffffff;
                    border: 1px solid #3a3a3a;
                    
                    &:hover {
                        background-color: #3a3a3a;
                        border-color: #4a4a4a;
                    }
                `;
            case 'success':
                return `
                    background-color: ${themeColors.colors.success.main};
                    color: #ffffff;
                    
                    &:hover {
                        background-color: ${themeColors.colors.success.dark};
                    }
                `;
            case 'error':
                return `
                    background-color: ${themeColors.colors.error.main};
                    color: #ffffff;
                    
                    &:hover {
                        background-color: ${themeColors.colors.error.dark};
                    }
                `;
            case 'warning':
                return `
                    background-color: ${themeColors.colors.warning.main};
                    color: #ffffff;
                    
                    &:hover {
                        background-color: ${themeColors.colors.warning.dark};
                    }
                `;
            case 'transparent':
                return `
                    background-color: transparent;
                    color: ${themeColors.colors.neutral.white};
                    border: 1px solid ${themeColors.colors.neutral.gray300};

                    &:hover {
                        background-color: ${themeColors.colors.neutral.gray200};
                        border-color: ${themeColors.colors.neutral.gray400};
                        color: ${themeColors.colors.neutral.gray800};
                    }
                `;
            default:
                return `
                    background-color: ${themeColors.colors.primary.main};
                    color: #ffffff;
                    
                    &:hover {
                        background-color: ${themeColors.colors.primary.dark};
                    }
                `;
        }
    }}

    &:active {
        transform: scale(0.98);
    }

    &:disabled {
        background-color: ${themeColors.colors.neutral.gray300};
        color: ${themeColors.colors.neutral.gray500};
        cursor: not-allowed;
    }

    ${(props) => {
        const sizeMap = {
            sm: {
                padding: `${themeColors.spacing.xs} ${themeColors.spacing.sm}`,
                fontSize: themeColors.typography.body.small.fontSize,
            },
            md: {
                padding: `${themeColors.spacing.sm} ${themeColors.spacing.md}`,
                fontSize: themeColors.typography.body.regular.fontSize,
            },
            lg: {
                padding: `${themeColors.spacing.md} ${themeColors.spacing.lg}`,
                fontSize: themeColors.typography.body.large.fontSize,
            },
        };

        const size = sizeMap[props.size || 'md'];

        return `
            padding: ${size.padding};
            font-size: ${size.fontSize}px;
        `;
    }}
`;
