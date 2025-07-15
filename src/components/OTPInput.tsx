'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { verifyOtp } from '@/lib/otpSimulator';
import { otpSchema } from '@/validations/authSchema';
import { Loader2 } from 'lucide-react';

type OTPForm = z.infer<typeof otpSchema>;

interface Props {
    onSuccess: () => void;
}

export const OTPInput = ({ onSuccess }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<OTPForm>({
        resolver: zodResolver(otpSchema)
    });

    const onSubmit = async (data: OTPForm) => {
        const success = await verifyOtp(data.otp);
        if (success) {
            alert('✅ OTP Verified!');
            onSuccess();
        } else {
            alert('❌ Invalid OTP');
        }
    };

    return (
        <div className="max-w-md w-full space-y-6">
            <div>
                <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Enter Verification Code
                </h2>
                <p className="mt-3 text-center text-gray-600 text-sm font-medium">
                    Please enter the 6-digit code we sent to your device
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <input
                        type="text"
                        placeholder="• • • • • •"
                        maxLength={6}
                        {...register('otp')}
                        className="appearance-none block w-full px-4 py-4 border-2 border-purple-100 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-2xl text-center tracking-[0.75em] font-mono transition-all duration-200 placeholder:text-gray-400"
                        aria-invalid={errors.otp ? "true" : "false"}
                    />
                </div>
                {errors.otp && (
                    <p className="text-sm text-red-600 bg-red-50/80 p-3 rounded-xl border border-red-100 font-medium" role="alert">
                        {errors.otp.message}
                    </p>
                )}
                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full flex justify-center py-3.5 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-200"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                Verifying...
                            </span>
                        ) : (
                            'Verify Code'
                        )}
                    </button>
                </div>
                <p className="text-center text-sm text-gray-600">
                    {`Didn't receive the code? `}<button type="button" className="font-semibold text-purple-600 hover:text-purple-700">Resend</button>
                </p>
            </form>
        </div>
    );
};
