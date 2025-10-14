import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IFoundItem {
    imageUrl: string;
    description: string;
    dateFound: Date;
    locationFound: string;
    admin: Schema.Types.ObjectId; // reference to User (admin)
    isReturned: boolean;
}

const FoundItemSchema = new Schema<IFoundItem>({
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    dateFound: { type: Date, required: true },
    locationFound: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isReturned: { type: Boolean, default: false }
}, { timestamps: true });

export const FoundItem = model<IFoundItem>('FoundItem', FoundItemSchema);
