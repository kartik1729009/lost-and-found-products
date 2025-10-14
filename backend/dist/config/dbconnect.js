import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongoURL = process.env.MONGO_URL;
if (!mongoURL) {
    throw new Error('MONGO_URL is not defined in the environment variables');
}
export const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process if connection fails
    }
};
//# sourceMappingURL=dbconnect.js.map