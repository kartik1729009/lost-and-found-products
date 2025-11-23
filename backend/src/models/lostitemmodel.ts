import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IComplaint extends Document {
    productType: string;
    dateLost: Date;
    lastKnownSpot: string;
    description: string;
    photoUrl?: string;
    student: Types.ObjectId; 
    status: 'pending' | 'reviewed' | 'resolved';
}

const ComplaintSchema = new Schema<IComplaint>({
    productType: { type: String, required: true },
    dateLost: { type: Date, required: true },
    lastKnownSpot: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' }
}, { timestamps: true });

export const Complaint = model<IComplaint>('Complaint', ComplaintSchema);
