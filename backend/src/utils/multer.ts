import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "lms",
            allowed_formats: ["jpg", "jpeg", "png"]
        };
    }
})

export const upload = multer({storage})