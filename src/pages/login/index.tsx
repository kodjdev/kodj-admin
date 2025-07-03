import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    const { sendOtp, verifyOtp, otpSent, error } = useAuth();
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
        } catch (_) {
            /* handled in context */
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            await verifyOtp(email, otp);
        } catch (_) {
            /* handled in context */
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
        />
    );
}
