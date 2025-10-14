import { Schema, model } from 'mongoose';
const ComplaintSchema = new Schema({
    productType: { type: String, required: true },
    dateLost: { type: Date, required: true },
    lastKnownSpot: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' }
}, { timestamps: true });
export const Complaint = model('Complaint', ComplaintSchema);
//# sourceMappingURL=lostitemmodel.js.map