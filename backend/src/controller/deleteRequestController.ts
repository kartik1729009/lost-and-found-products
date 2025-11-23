import { Request, Response } from "express";
import { Complaint } from "../models/lostitemmodel.js";
import { FoundItem } from "../models/founditemmodel.js";

export const deleteComplaint = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedComplaint = await Complaint.findByIdAndDelete(id);

        if (!deletedComplaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Complaint deleted successfully",
            deletedComplaint,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error deleting complaint",
            error: error.message,
        });
    }
};

export const deleteFoundItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedItem = await FoundItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Found item not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Found item deleted successfully",
            deletedItem,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error deleting found item",
            error: error.message,
        });
    }
};
