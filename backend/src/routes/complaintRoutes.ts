import express from 'express';
import { createComplaint } from '../controller/complaintController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('photo'), createComplaint);

export default router;