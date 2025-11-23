import { mailer } from "../utils/mailer.js";
export const sendMailController = async (req, res) => {
    try {
        const { to, subject, html } = req.body;
        if (!to || !subject || !html) {
            return res.status(400).json({
                success: false,
                message: "to, subject and html are required",
            });
        }
        const info = await mailer.sendMail({
            from: `"My App" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
            messageId: info.messageId,
        });
    }
    catch (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send email",
            error: error.message,
        });
    }
};
//# sourceMappingURL=email.js.map