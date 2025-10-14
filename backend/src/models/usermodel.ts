import { Schema, model, Document } from 'mongoose';

export interface IUser {
    username: string;
    password: string;
    role: 'student' | 'admin';
}

// This interface includes Mongoose Document properties
export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], required: true }
}, { timestamps: true });

export const User = model<IUserDocument>('User', UserSchema);
