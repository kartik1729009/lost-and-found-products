import express from 'express';
import { createComplaint, getComplaintDetails } from '../controller/complaintController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('photo'), createComplaint);

router.get('/:id', getComplaintDetails);

export default router;
