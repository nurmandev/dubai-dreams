import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "omnis_properties",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "pdf"],
  } as any,
});

export const upload = multer({ storage });
