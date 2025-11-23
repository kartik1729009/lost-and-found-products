interface OtpRecord {
    otp: string;
    expiresAt: number;
}
export declare const saveOtp: (email: string, otp: string) => void;
export declare const getOtp: (email: string) => OtpRecord | undefined;
export declare const deleteOtp: (email: string) => void;
export {};
//# sourceMappingURL=otpStore.d.ts.map