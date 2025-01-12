import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

//cloudinary configuration for blog uploads
const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_images",
    format: async () => "jpeg",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

//cloudinary configuration for package uploads
const packageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "trek_packages",
    format: async () => "jpg",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

// Common file filter function for validating file type is image
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

//multer configuration for blog upload
export const blogUpload = multer({
  storage: blogStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: imageFileFilter,
});

//multer configuration for package upload
export const packageUpload = multer({
  storage: packageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: imageFileFilter,
});
