import express from "express";
import {
  sendOtpController,
  verifyOtpController,
} from "../controller/otpController.js";

const otpRouter = express.Router();

otpRouter.post("/send-otp", sendOtpController);
otpRouter.post("/verify-otp", verifyOtpController);

export default otpRouter;
