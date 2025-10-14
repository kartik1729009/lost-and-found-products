import mongoose, { Schema, Types } from 'mongoose';
export interface IFoundItem {
    imageUrl: string;
    description: string;
    dateFound: Date;
    locationFound: string;
    admin: Schema.Types.ObjectId;
    isReturned: boolean;
}
export declare const FoundItem: mongoose.Model<IFoundItem, {}, {}, {}, mongoose.Document<unknown, {}, IFoundItem, {}, {}> & IFoundItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=founditemmodel.d.ts.map