import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "omnis_properties",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "pdf"],
    public_id: (req: any, file: any) => {
      const cleanName = file.originalname.split(".")[0].replace(/[^a-zA-Z0-9_-]/g, "_");
      return `${cleanName}_${Date.now()}`;
    }
  } as any,
});

export const upload = multer({ storage });
