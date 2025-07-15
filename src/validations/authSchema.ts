import * as z from 'zod';

export const phoneSchema = z.object({
  countryCode: z.string().min(1),
  phone: z.string().min(7).max(15)
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits")
});
