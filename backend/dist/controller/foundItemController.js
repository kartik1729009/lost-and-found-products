import cloudinary from "../config/cloudinary.js";
import { FoundItem } from "../models/founditemmodel.js";
export const uploadFoundItem = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }
        // Upload file buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "found-items" }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            if (!req.file) {
                return res.status(400).json({ error: "Image file is required" });
            }
            stream.end(req.file.buffer);
        });
        const { description, itemType, dateFound, locationFound, admin } = req.body;
        const foundItem = await FoundItem.create({
            description,
            itemType,
            dateFound,
            locationFound,
            admin,
            imageUrl: result.secure_url,
        });
        res.status(201).json(foundItem);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//# sourceMappingURL=foundItemController.js.map