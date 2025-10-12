import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "../../utils/slugify";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

// Ensure folder exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

// Helper to save a single file
export const saveFileFromMemory = (
  file: Express.Multer.File,
  folder = ""
): string => {
  if (!file) throw new Error("No file provided");

  // Folder path (e.g. uploads/avatars)
  const folderPath = folder ? path.join(UPLOAD_ROOT, folder) : UPLOAD_ROOT;

  // Ensure subfolder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Create clean unique file name
  const ext = path.extname(file.originalname);
  const baseName = slugify(path.basename(file.originalname, ext));
  const uniqueName = `${baseName}-${uuidv4()}${ext}`;

  // Write the file buffer to disk
  const filePath = path.join(folderPath, uniqueName);
  fs.writeFileSync(filePath, file.buffer);

  // Return the URL (assuming you serve /uploads statically)
  const fileUrl = `${process.env.BASE_URL || "http://localhost:5000"}/uploads${
    folder ? "/" + folder : ""
  }/${uniqueName}`;
  return fileUrl;
};

// Helper to save multiple files
export const saveMultipleFilesFromMemory = (
  files: Express.Multer.File[],
  folder = ""
): string[] => {
  return files.map((file) => saveFileFromMemory(file, folder));
};
