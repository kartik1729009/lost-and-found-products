import { mailer } from "../utils/mailer.js";
import { otpTemplate } from "../templates/otpTemplate.js";
import { saveOtp, getOtp, deleteOtp } from "../utils/otpStore.js";
// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
// Send OTP to email
export const sendOtpController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email required" });
        const otp = generateOtp();
        // Save OTP temporarily
        saveOtp(email, otp);
        await mailer.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Your Login OTP",
            html: otpTemplate(otp),
        });
        res.status(200).json({ message: "OTP sent to email" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};
// Verify OTP
export const verifyOtpController = (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.status(400).json({ message: "Email and OTP required" });
        const record = getOtp(email);
        if (!record)
            return res.status(400).json({ message: "No OTP found for this email" });
        if (Date.now() > record.expiresAt) {
            deleteOtp(email);
            return res.status(400).json({ message: "OTP expired" });
        }
        if (otp !== record.otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        deleteOtp(email);
        // Success → Return any token if needed
        return res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Verification failed" });
    }
};
//# sourceMappingURL=otpController.js.map