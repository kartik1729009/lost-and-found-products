import express from 'express';
import { 
  getFoundItems, 
  markFoundItemReturned 
} from '../controller/getcontroller.js';
import { 
  getAllComplaints, 
  getComplaintById, 
  updateComplaintStatus 
} from '../controller/getcontroller.js';

const router = express.Router();

router.get('/found-items', getFoundItems);
router.patch('/found-items/:id/return', markFoundItemReturned);

router.get('/complaints', getAllComplaints);
router.get('/complaints/:id', getComplaintById);
router.patch('/complaints/:id/status', updateComplaintStatus);

export default router;
