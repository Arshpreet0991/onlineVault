import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = async function (localFilePath) {
  if (!localFilePath) return null;

  const response = await cloudinary.uploader.upload(localFilePath, {
    resource_type: "image",
  });
  console.log("upload to cloudinary successful");
  fs.unlinkSync(localFilePath);
  return null;
};

export { uploadToCloudinary };
