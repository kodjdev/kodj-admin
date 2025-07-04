'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { themeColors } from '@/themes/themeColors';
import StyledOtpSection from '@/components/auth/OtpSelection';

type LoginFormProps = {
    onSubmit: (email: string, password: string) => Promise<void>;
    onVerify: () => Promise<void>;
    error: string | null;
    loading: boolean;
    otpSent: boolean;
    otp: string;
    setOtp: (otp: string) => void;
    onResendOtp?: (email: string, password: string) => Promise<void>;
};

const LoginContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: rgba(10, 10, 10, 0.9);
    position: relative;
    isolation: isolate;
`;

const TopSection = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    background-color: transparent;
`;

const BottomSection = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(10, 10, 10, 0.3) 30%,
        rgba(10, 10, 10, 0.6) 60%,
        rgba(10, 10, 10, 0.8) 100%
    );
    z-index: 1;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        transform: translateY(30%);
        background-image: url('/kodj.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.4;
        filter: blur(0.2px);
    }
`;
const LoginCard = styled.div`
    background-color: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: ${themeColors.cardBorder.xl};
    padding: ${themeColors.spacing.xxl};
    width: 100%;
    max-width: 440px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
    text-align: center;
    margin-bottom: ${themeColors.spacing.xl};
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${themeColors.spacing.sm};
    margin-bottom: ${themeColors.spacing.md};
`;

const LogoIcon = styled.div`
    width: 40px;
    height: 40px;
    background-color: #4f46e5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
`;

const LogoText = styled.h1`
    color: #ffffff;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
`;

const Title = styled.h2`
    color: #ffffff;
    font-size: ${themeColors.typography.headings.desktop.h4.fontSize}px;
    font-weight: ${themeColors.typography.headings.desktop.h4.fontWeight};
    text-align: left;
    margin: 0 0 ${themeColors.spacing.lg} 0;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.lg};
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${themeColors.spacing.xs};
`;

const Input = styled.input`
    background-color: #0a0a0a;
    border: 1px solid #2a2a2a;
    border-radius: ${themeColors.cardBorder.md};
    padding: ${themeColors.spacing.md};
    color: #ffffff;
    font-size: ${themeColors.typography.body.regular.fontSize}px;
    transition: all ${themeColors.transitions.normal};

    &:focus {
        outline: none;
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    &::placeholder {
        color: #6a6a6a;
    }
`;

const LoginButton = styled.button`
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: ${themeColors.cardBorder.md};
    padding: ${themeColors.spacing.md};
    font-size: ${themeColors.typography.body.regular.fontSize}px;
    font-weight: 600;
    cursor: pointer;
    transition: all ${themeColors.transitions.normal};
    margin-top: ${themeColors.spacing.sm};

    &:hover:not(:disabled) {
        background-color: #4338ca;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: ${themeColors.cardBorder.md};
    padding: ${themeColors.spacing.sm} ${themeColors.spacing.md};
    color: #ef4444;
    font-size: ${themeColors.typography.body.small.fontSize}px;
    text-align: center;
`;

export default function LoginForm({
    onSubmit,
    onVerify,
    error: authError,
    loading,
    otpSent,
    otp,
    setOtp,
    onResendOtp,
}: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otpSent) {
            await onVerify();
        } else {
            await onSubmit(formData.email, formData.password);
        }
    };

    return (
        <LoginContainer>
            <TopSection>
                <LoginCard>
                    <LogoContainer>
                        <Logo>
                            <LogoIcon>K</LogoIcon>
                            <LogoText>Kodj Admin</LogoText>
                        </Logo>
                    </LogoContainer>

                    <Title>Sign in to your account</Title>

                    <Form onSubmit={handleSubmit}>
                        {authError && <ErrorMessage>{authError}</ErrorMessage>}

                        {!otpSent && (
                            <>
                                <InputGroup>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                    />
                                </InputGroup>

                                <InputGroup>
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="current-password"
                                    />
                                </InputGroup>
                            </>
                        )}

                        {otpSent && (
                            <StyledOtpSection
                                email={formData.email}
                                otp={otp}
                                onOtpChange={setOtp}
                                onBackClick={() => {
                                    setOtp('');
                                    setFormData({ email: '', password: '' });
                                }}
                                onResendClick={() => {
                                    if (onResendOtp) {
                                        onResendOtp(formData.email, formData.password);
                                    }
                                }}
                                resendDisabled={false}
                                resendCountdown={0}
                            />
                        )}
                        <LoginButton type="submit" disabled={loading}>
                            {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
                        </LoginButton>
                    </Form>
                </LoginCard>
            </TopSection>
            <BottomSection />
        </LoginContainer>
    );
}
