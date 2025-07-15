'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CountrySelect } from '@/components/CountrySelect';
import { sendOtp } from '@/lib/otpSimulator';
import { phoneSchema } from '@/validations/authSchema';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { OTPInput } from '@/components/OTPInput';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';

type PhoneForm = z.infer<typeof phoneSchema>;

export default function LoginPage() {
    const router = useRouter();
    const login = useAppStore((s) => s.login);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [phoneWithCode, setPhoneWithCode] = useState('');
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors }
    } = useForm<PhoneForm>({
        resolver: zodResolver(phoneSchema)
    });

    const onSubmit = async (data: PhoneForm) => {
        try {
            setIsLoading(true);
            const fullPhone = `${data.countryCode}${data.phone}`;
            setPhoneWithCode(fullPhone);
            const success = await sendOtp(fullPhone);
            if (success) {
                login({ phone: fullPhone, name: 'Femil Patodiya' });
                Cookies.set(
                    'easy-chat-store',
                    JSON.stringify({
                        state: {
                            isLoggedIn: true,
                            phone: fullPhone,
                            name: 'Femil Patodiya',
                        },
                    }),
                    { expires: 7 }
                );
                setOtpSent(true);
            }
        } catch {
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const onVerified = () => {
        toast.success('Login successful!');
        router.push('/dashboard');
        // Redirect or perform other logic
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-200 via-purple-100 to-indigo-200 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 hover:shadow-purple-100 transition-all duration-300">
                <div>
                    <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">Welcome Back</h2>
                    <p className="text-center text-gray-600 text-sm font-medium">Secure login with OTP verification</p>
                </div>
                {!otpSent ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Country Code</label>
                                <CountrySelect
                                    value={getValues('countryCode')}
                                    onChange={(value) => { setValue('countryCode', value) }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    {...register('phone')}
                                    placeholder="Enter your phone number"
                                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border-2 border-purple-100 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        {errors.phone && (
                            <p className="text-sm text-red-600 bg-red-50/80 p-3 rounded-xl border border-red-100 font-medium">
                                {errors.phone.message}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Verifying...
                                </>
                            ) : (
                                'Get Verification Code'
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6 mt-8">
                        <p className="text-center text-gray-600">
                            OTP sent to <strong>{phoneWithCode}</strong>
                        </p>
                        <OTPInput onSuccess={onVerified} />
                    </div>
                )}
            </div>
        </div>
    );
}
