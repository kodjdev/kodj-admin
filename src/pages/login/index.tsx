import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    const { sendOtp, verifyOtp, otpSent, error, resendOtp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const handleLogin = async (email: string, password: string) => {
        try {
            setLoading(true);
            setEmail(email);
            setPassword(password);
            await sendOtp(email, password);
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            await verifyOtp(otp);
        } catch (err) {
            console.error('OTP verification failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReSendOtp = async () => {
        try {
            setLoading(true);
            await resendOtp(email, password);
        } catch (error) {
            console.error('Resend OTP failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginForm
            onSubmit={handleLogin}
            onVerify={handleVerifyOtp}
            error={error}
            loading={loading}
            otpSent={otpSent}
            otp={otp}
            setOtp={setOtp}
            onResendOtp={handleReSendOtp}
        />
    );
}
