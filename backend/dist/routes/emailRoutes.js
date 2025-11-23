import express from "express";
import { sendMailController } from "../controller/email.js";
const emailRouter = express.Router();
emailRouter.post("/send-email", sendMailController);
export default emailRouter;
//# sourceMappingURL=emailRoutes.js.map