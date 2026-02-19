import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadCloudinary=async (filePath, folder)=>{
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder,resource_type: "auto" });
        fs.unlinkSync(filePath);
        return result; 
        
    } catch (error) {
        fs.unlinkSync(filePath);
        throw error;
    }
}

export default uploadCloudinary