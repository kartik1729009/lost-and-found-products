import mongoose, { Document, Types } from 'mongoose';
export interface IComplaint extends Document {
    productType: string;
    dateLost: Date;
    lastKnownSpot: string;
    description: string;
    photoUrl?: string;
    student: Types.ObjectId;
    status: 'pending' | 'reviewed' | 'resolved';
}
export declare const Complaint: mongoose.Model<IComplaint, {}, {}, {}, mongoose.Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=lostitemmodel.d.ts.map