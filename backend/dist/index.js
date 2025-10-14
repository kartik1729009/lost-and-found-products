import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { connectDB } from './config/dbconnect.js'; // Import your MongoDB connection
import { fileURLToPath } from 'url';
// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();
const upload = multer();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
import authRoutes from './routes/userroutes.js';
import getRoutes from './routes/otherroutes.js';
import foundItemRoutes from './routes/foundItemRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
// Connect to MongoDB
connectDB();
// API Routes
app.use('/api/auth', authRoutes); // /register, /login
app.use('/api/data', getRoutes); // /found-items, /complaints (GET & PATCH)
app.use('/api/found-items', foundItemRoutes); // For uploading new found items
app.use('/api/complaints', complaintRoutes); // For filing complaints
// Health check route
app.get('/', (req, res) => {
    res.send('Lost & Found API is running');
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map