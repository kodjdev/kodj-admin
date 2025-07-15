import React from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { themeColors } from '@/themes/themeColors';

type StyledOtpSectionProps = {
    email: string;
    otp: string;
    onOtpChange: (value: string) => void;
    onBackClick: () => void;
    onResendClick?: () => void;
    resendDisabled?: boolean;
    resendCountdown?: number;
};

const OtpContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.md};
`;

const BackButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${themeColors.spacing.xs};
    background: none;
    border: none;
    color: ${themeColors.colors.primary.main};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-family: ${themeColors.typography.fontFamily.primary};
    cursor: pointer;
    padding: ${themeColors.spacing.xs} 0;
    align-self: flex-start;
    transition: color ${themeColors.transitions.fast} ease;

    &:hover {
        color: ${themeColors.dark.text};
    }
`;

const OtpMessage = styled.p`
    color: ${themeColors.dark.textSecondary};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-family: ${themeColors.typography.fontFamily.primary};
    margin: 0;
    text-align: left;
`;

const EmailHighlight = styled.span`
    color: ${themeColors.dark.text};
    font-weight: 500;
`;

const InputGroup = styled.div`
    position: relative;
`;

const OtpInput = styled.input`
    width: 100%;
    padding: ${themeColors.spacing.md} ${themeColors.spacing.lg};
    background: ${themeColors.dark.inputBackground};
    border: 2px solid ${themeColors.dark.inputBorder};
    border-radius: ${themeColors.cardBorder.md};
    color: ${themeColors.dark.text};
    font-size: ${themeColors.typography.body.regular.fontSize}px;
    font-family: ${themeColors.typography.fontFamily.primary};
    text-align: center;
    letter-spacing: 2px;
    transition: all ${themeColors.transitions.normal} ease;
    box-sizing: border-box;

    &::placeholder {
        color: ${themeColors.dark.placeholder};
        letter-spacing: normal;
    }

    &:focus {
        outline: none;
        border-color: ${themeColors.colors.primary.main};
        background: ${themeColors.dark.surface};
    }

    &:hover {
        border-color: ${themeColors.dark.border};
    }
`;

const ResendSection = styled.div`
    text-align: center;
`;

const ResendText = styled.span`
    color: ${themeColors.dark.placeholder};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-family: ${themeColors.typography.fontFamily.primary};
`;

const ResendButton = styled.button`
    background: none;
    border: none;
    color: ${themeColors.colors.primary.main};
    font-size: ${themeColors.typography.body.small.fontSize}px;
    font-family: ${themeColors.typography.fontFamily.primary};
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    margin-left: ${themeColors.spacing.xs};
    transition: color ${themeColors.transitions.fast} ease;

    &:hover {
        color: ${themeColors.dark.text};
    }

    &:disabled {
        color: ${themeColors.dark.placeholder};
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

export default function StyledOtpSection({
    email,
    otp,
    onOtpChange,
    onBackClick,
    onResendClick,
    resendDisabled = false,
    resendCountdown = 0,
}: StyledOtpSectionProps) {
    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

    return (
        <OtpContainer>
            <BackButton onClick={onBackClick}>
                <ArrowLeft size={16} />
                Use different email
            </BackButton>

            <OtpMessage>
                Enter the 6-digit code sent to <EmailHighlight>{maskedEmail}</EmailHighlight>
            </OtpMessage>

            <InputGroup>
                <OtpInput
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => onOtpChange(e.target.value)}
                    maxLength={6}
                    autoComplete="one-time-code"
                />
            </InputGroup>

            {onResendClick && (
                <ResendSection>
                    <ResendText>Didn`&apos;`t receive the code?</ResendText>
                    <ResendButton onClick={onResendClick} disabled={resendDisabled}>
                        {resendDisabled && resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend'}
                    </ResendButton>
                </ResendSection>
            )}
        </OtpContainer>
    );
}
