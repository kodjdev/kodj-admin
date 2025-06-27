import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
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
        const variant = props.variant || 'primary';
        const colors = themeColors.colors[variant];

        return `
      background-color: ${colors.main};
      color: ${colors.contrast};
      
      &:hover {
        background-color: ${colors.dark};
      }
      
      &:active {
        background-color: ${colors.dark};
        transform: scale(0.98);
      }
      
      &:disabled {
        background-color: ${themeColors.colors.neutral.gray300};
        color: ${themeColors.colors.neutral.gray500};
        cursor: not-allowed;
      }
    `;
    }}

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
