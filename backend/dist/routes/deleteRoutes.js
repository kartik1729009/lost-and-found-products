import { Router } from "express";
import { deleteComplaint, deleteFoundItem } from "../controller/deleteRequestController.js";
const router = Router();
router.delete("/complaint/:id", deleteComplaint);
router.delete("/found-item/:id", deleteFoundItem);
export default router;
//# sourceMappingURL=deleteRoutes.js.map