const otpStore = new Map();
export const saveOtp = (email, otp) => {
    otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000 // expires in 10 minutes
    });
};
export const getOtp = (email) => {
    return otpStore.get(email);
};
export const deleteOtp = (email) => {
    otpStore.delete(email);
};
//# sourceMappingURL=otpStore.js.map