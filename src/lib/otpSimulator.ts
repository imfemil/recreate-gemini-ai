export const sendOtp = (phone: string): Promise<boolean> => {
  console.log('Sending OTP to', phone);
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1500);
  });
};

export const verifyOtp = (otp: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(otp === '123456'), 1000);
  });
};
