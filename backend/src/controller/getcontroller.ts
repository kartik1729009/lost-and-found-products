import { Request, Response } from 'express';
import { FoundItem } from '../models/founditemmodel.js';
import { Complaint } from '../models/lostitemmodel.js';

// ✅ Get all found items (for UI display)
export const getFoundItems = async (req: Request, res: Response) => {
  try {
    const items = await FoundItem.find().populate('admin', 'username'); 
    res.status(200).json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all complaints (for admin dashboard)
export const getAllComplaints = async (req: Request, res: Response) => {
  try {
    // Fetch all complaints and populate student details
    const complaints = await Complaint.find()
      .populate('student', 'username role') // only fetch username & role
      .sort({ createdAt: -1 }); // newest first (optional)

    res.status(200).json(complaints);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get complaint by ID (optional, if admin wants details of one complaint)
export const getComplaintById = async (req: Request, res: Response) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'username role');

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.status(200).json(complaint);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // complaint ID
    const { status } = req.body; // 'pending' | 'reviewed' | 'resolved'

    // Validate status
    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true } // return updated document
    );

    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    res.status(200).json(complaint);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ Admin marks found item as returned
export const markFoundItemReturned = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // found item ID

    const foundItem = await FoundItem.findByIdAndUpdate(
      id,
      { isReturned: true },
      { new: true } // return updated document
    );

    if (!foundItem) return res.status(404).json({ error: 'Found item not found' });

    res.status(200).json(foundItem);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
