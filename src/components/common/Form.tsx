import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.lg};
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.xs};
`;

export const FormRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${themeColors.spacing.md};
`;

export const Label = styled.label`
    color: ${themeColors.colors.neutral.gray300};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-weight: 500;
`;

export const Input = styled.input`
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.md};
    border: 1px solid ${themeColors.dark.inputBorder};
    border-radius: ${themeColors.cardBorder.md};
    font-size: ${themeColors.typography.body.regular.fontSize}px;
    color: ${themeColors.dark.text};
    background-color: ${themeColors.dark.inputBackground};
    transition: all ${themeColors.transitions.normal};

    &:focus {
        outline: none;
        border-color: ${themeColors.colors.primary.main};
        box-shadow: 0 0 0 3px ${themeColors.colors.primary.main}20;
    }

    &:disabled {
        background-color: ${themeColors.dark.surfaceSecondary};
        cursor: not-allowed;
    }

    &::placeholder {
        color: ${themeColors.dark.placeholder};
    }
`;

export const Textarea = styled.textarea`
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.md};
    border: 1px solid ${themeColors.dark.inputBorder};
    border-radius: ${themeColors.cardBorder.md};
    font-size: ${themeColors.typography.body.regular.fontSize}px;
    color: ${themeColors.dark.text};
    background-color: ${themeColors.dark.inputBackground};
    transition: all ${themeColors.transitions.normal};
    resize: vertical;
    min-height: 120px;
    font-family: ${themeColors.typography.fontFamily.primary};

    &:focus {
        outline: none;
        border-color: ${themeColors.colors.primary.main};
        box-shadow: 0 0 0 3px ${themeColors.colors.primary.main}20;
    }

    &:disabled {
        background-color: ${themeColors.dark.surfaceSecondary};
        cursor: not-allowed;
    }

    &::placeholder {
        color: ${themeColors.dark.placeholder};
    }
`;

export const FileInputLabel = styled.label`
    display: inline-block;
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.md};
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: ${themeColors.cardBorder.md};
    cursor: pointer;
    transition: all ${themeColors.transitions.normal};
    color: #ffffff;

    &:hover {
        background-color: #3a3a3a;
    }
`;

export const Select = styled.select`
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.md};
    border: 1px solid ${themeColors.cardBorder.color};
    border-radius: ${themeColors.cardBorder.md};
    font-size: ${themeColors.typography.body.regular.fontSize}px;
    color: ${themeColors.dark.text};
    background-color: ${themeColors.dark.background};
    transition: all ${themeColors.transitions.normal};
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${themeColors.colors.primary.main};
        box-shadow: 0 0 0 3px ${themeColors.colors.primary.main}20;
    }

    &:disabled {
        background-color: ${themeColors.colors.neutral.gray100};
        cursor: not-allowed;
    }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
    width: 20px;
    height: 20px;
    cursor: pointer;
`;

export const ErrorMessage = styled.span`
    color: ${themeColors.colors.error.main};
    font-size: ${themeColors.typography.body.small.fontSize}px;
`;

export const HelperText = styled.span`
    color: ${themeColors.colors.neutral.gray500};
    font-size: ${themeColors.typography.body.small.fontSize}px;
`;
