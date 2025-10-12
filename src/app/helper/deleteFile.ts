import path from "path";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./S3";
import fs from "fs";

const deleteUploadImage = async (imagePath: string): Promise<boolean> => {
  try {
    const fullPath = path.join(__dirname, "../../../uploads", imagePath);
    console.log("Full path:", fullPath); // Debugging
    await fs.promises.unlink(fullPath);
    return true; // Indicate success
  } catch (err) {
    console.error(`Error deleting file ${imagePath}:`, err);
    return false; // Throw the error so it can be caught where the function is called
  }
};

const deleteFileFromFolder = async (fileUrl: string) => {
  try {
    // Extract the filename from the URL
    const filename = path.basename(new URL(fileUrl).pathname);
    const fullPath = path.join(process.cwd(), "uploads", filename);

    // console.log(filename, fullPath);

    await fs.promises.access(fullPath);
    await fs.promises.unlink(fullPath);
    // console.log(`Deleted file: ${filename}`);
  } catch (error) {
    console.error(`Failed to delete file: ${fileUrl}`, error);
  }
};

const deleteS3Image = async (imagePath: string) => {
  if (!imagePath) {
    console.warn("No image path provided");
    return false;
  }
  try {
    // Use DeleteObjectCommand
    const command = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACE_BUCKET,
      Key: imagePath,
    });

    await s3.send(command);
    return true;
  } catch (err) {
    return false;
  }
};

export const deleteFile = {
  deleteUploadImage,
  deleteS3Image,
  deleteFileFromFolder,
};
