import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], required: true }
}, { timestamps: true });
export const User = model('User', UserSchema);
//# sourceMappingURL=usermodel.js.map