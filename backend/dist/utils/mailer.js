import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
// Optional — help debug email payloads
mailer.use("compile", (mail, callback) => {
    console.log("NODEMAILER MAIL DATA:", mail.data);
    callback();
});
//# sourceMappingURL=mailer.js.map