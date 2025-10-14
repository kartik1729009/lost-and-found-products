import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// 2️⃣ Import Cloudinary
import { v2 as cloudinary } from 'cloudinary';
// 3️⃣ Get env variables
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;
// 4️⃣ Check if they exist
if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Missing Cloudinary environment variables');
}
// 5️⃣ Configure Cloudinary
cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
});
export default cloudinary;
//# sourceMappingURL=cloudinary.js.map