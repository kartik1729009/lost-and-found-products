import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { connectDB } from './config/dbconnect.js';
import { fileURLToPath } from 'url';
import deleteRoutes from "./routes/deleteRoutes.js";
// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();
const upload = multer();

// Middleware - Updated CORS for development
app.use(cors({
  origin: ['https://lost-and-found-products-dok7.vercel.app', 'http://localhost:5173', 'http://127.0.0.1:5173'], // Multiple origins for safety
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import authRoutes from './routes/userroutes.js';
import getRoutes from './routes/otherroutes.js';
import foundItemRoutes from './routes/foundItemRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import emailRouter from "./routes/emailRoutes.js";
import otpRouter from "./routes/otpRoutes.js";

// Connect MongoDB
connectDB();

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/data', getRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/email', emailRouter);
app.use("/api/otp", otpRouter);
app.use("/api/delete", deleteRoutes);
// Health
app.get('/', (req: Request, res: Response) => {
    res.send('Lost & Found API is running');
});

// Start server - Make sure this is 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});