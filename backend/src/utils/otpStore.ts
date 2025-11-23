interface OtpRecord {
  otp: string;
  expiresAt: number;
}

const otpStore = new Map<string, OtpRecord>();

export const saveOtp = (email: string, otp: string) => {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // expires in 10 minutes
  });
};

export const getOtp = (email: string): OtpRecord | undefined => {
  return otpStore.get(email);
};

export const deleteOtp = (email: string) => {
  otpStore.delete(email);
};
