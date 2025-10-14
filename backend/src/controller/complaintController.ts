import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';
import { Complaint } from '../models/lostitemmodel.js';
import { Types } from 'mongoose';

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const { productType, dateLost, lastKnownSpot, description, student } = req.body;

    if (!productType || !dateLost || !lastKnownSpot || !description || !student) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate student as ObjectId
    if (!Types.ObjectId.isValid(student)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    let photoUrl: string | undefined;

    if (req.file) {
      // Upload image buffer to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'complaints' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
        }
        stream.end(req.file.buffer);
      });

      photoUrl = result.secure_url;
    }

    const complaint = await Complaint.create({
      productType,
      dateLost,
      lastKnownSpot,
      description,
      student,
      photoUrl,
    });

    res.status(201).json(complaint);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
