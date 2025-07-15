'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CountrySelect } from '@/components/CountrySelect';
import { sendOtp } from '@/lib/otpSimulator';
import { Loader2 } from 'lucide-react';
import { OTPInput } from '@/components/OTPInput';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

// Validation Schema
const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  countryCode: z.string().min(1, 'Select a country code'),
  phone: z.string().min(5, 'Phone number is too short'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
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
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);
      const fullPhone = `${data.countryCode}${data.phone}`;
      setPhoneWithCode(fullPhone);
      const success = await sendOtp(fullPhone);
      if (success) {
        login({ phone: fullPhone, name: data.name });
        Cookies.set(
          'easy-chat-store',
          JSON.stringify({
            state: {
              isLoggedIn: true,
              phone: fullPhone,
              name: data.name,
            },
          }),
          { expires: 7 }
        );
        setOtpSent(true);
        toast.success('OTP sent successfully!');
      }
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerified = () => {
    toast.success('Signup successful! Redirecting to Dashboard...');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 via-purple-100 to-indigo-200 px-4">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 hover:shadow-indigo-100 transition-all duration-300">
        <div>
          <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 text-sm font-medium">Sign up with phone verification</p>
        </div>
        {!otpSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Enter your full name"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border-2 border-pink-100 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country Code</label>
                <CountrySelect
                  value={getValues('countryCode')}
                  onChange={(value) => setValue('countryCode', value)}
                />
                {errors.countryCode && <p className="text-sm text-red-600 mt-1">{errors.countryCode.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border-2 border-pink-100 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Sending...
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
