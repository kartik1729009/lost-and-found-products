import { Schema, model } from 'mongoose';
const FoundItemSchema = new Schema({
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    dateFound: { type: Date, required: true },
    locationFound: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isReturned: { type: Boolean, default: false }
}, { timestamps: true });
export const FoundItem = model('FoundItem', FoundItemSchema);
//# sourceMappingURL=founditemmodel.js.map