import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*
cloudinary.config({
  cloud_name: "dvezraqky",
  api_key: "355666617196797",
  api_secret: "XaVxb1WO0KvFWw6WGXLowbX5lXo",
});
*/
const uploadToCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("upload to cloudinary successful", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("Error while uploading to Cloudinary", error);
    return null;
  }
};

export { uploadToCloudinary };
