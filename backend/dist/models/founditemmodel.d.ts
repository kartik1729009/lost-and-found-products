import mongoose, { Document, Types } from 'mongoose';
export interface IFoundItem extends Document {
    itemType: string;
    imageUrl: string;
    description: string;
    dateFound: Date;
    locationFound: string;
    admin: Types.ObjectId;
    isReturned: boolean;
}
export declare const FoundItem: mongoose.Model<IFoundItem, {}, {}, {}, mongoose.Document<unknown, {}, IFoundItem, {}, {}> & IFoundItem & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=founditemmodel.d.ts.map