import { Document } from 'mongoose';
export interface IUser {
    username: string;
    password: string;
    role: 'student' | 'admin';
}
export interface IUserDocument extends IUser, Document {
}
export declare const User: import("mongoose").Model<IUserDocument, {}, {}, {}, Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=usermodel.d.ts.map