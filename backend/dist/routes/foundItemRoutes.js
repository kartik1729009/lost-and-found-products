import express from 'express';
import { uploadFoundItem } from '../controller/foundItemController.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
// Single file upload, input field name is 'image'
router.post('/', upload.single('image'), uploadFoundItem);
export default router;
//# sourceMappingURL=foundItemRoutes.js.map