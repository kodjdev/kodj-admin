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

const OtpInputContainer = styled.div`
    display: flex;
    gap: ${themeColors.spacing.sm};
    justify-content: center;
`;

const SingleOtpInput = styled.input`
    width: 60px;
    height: 60px;
    background: ${themeColors.dark.inputBackground};
    border: 2px solid ${themeColors.dark.inputBorder};
    border-radius: 20%;
    color: ${themeColors.dark.text};
    font-size: ${themeColors.typography.body.large.fontSize}px;
    font-family: ${themeColors.typography.fontFamily.primary};
    text-align: center;
    transition: all ${themeColors.transitions.normal} ease;
    box-sizing: border-box;

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
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);

        if (pastedData.length > 0) {
            onOtpChange(pastedData.padEnd(5, ''));

            // Focus the next empty input or last input
            const nextIndex = Math.min(pastedData.length, 4);
            const nextInput = document.querySelector(`input[data-index="${nextIndex}"]`) as HTMLInputElement;
            nextInput?.focus();
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = otp.split('');
        newOtp[index] = value;
        const updatedOtp = newOtp.join('');

        if (updatedOtp.length <= 5) {
            onOtpChange(updatedOtp);

            if (value && index < 4) {
                const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
                nextInput?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
            prevInput?.focus();
        }
    };

    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

    return (
        <OtpContainer>
            <BackButton onClick={onBackClick}>
                <ArrowLeft size={16} />
                Use different email
            </BackButton>

            <OtpMessage>
                Enter the 5-digit code sent to
                <EmailHighlight>{maskedEmail}</EmailHighlight>
            </OtpMessage>

            <OtpInputContainer>
                {Array.from({ length: 5 }, (_, index) => (
                    <SingleOtpInput
                        key={index}
                        data-index={index}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]"
                        maxLength={1}
                        value={otp[index] || ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleOtpChange(value, index);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        autoComplete="one-time-code"
                    />
                ))}
            </OtpInputContainer>

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
