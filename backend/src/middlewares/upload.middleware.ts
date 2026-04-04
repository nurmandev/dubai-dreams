import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    const cleanName = file.originalname
      .split(".")[0]
      .replace(/[^a-zA-Z0-9_-]/g, "_");
      
    let resource_type: "image" | "video" | "raw" = "image";
    let allowed_formats: string[] | undefined = [
      "jpg",
      "png",
      "jpeg",
      "webp",
    ];

    if (ext === "pdf" || file.mimetype === "application/pdf") {
      resource_type = "raw";
      allowed_formats = undefined; // raw doesn't support allowed_formats in the same way
    } else if (
      ext === "mp4" ||
      ext === "mov" ||
      file.mimetype?.startsWith("video/")
    ) {
      resource_type = "video";
      allowed_formats = ["mp4", "mov"];
    }

    return {
      folder: "omnis_properties",
      resource_type: resource_type,
      public_id: `${cleanName}_${Date.now()}`,
      allowed_formats: allowed_formats,
    };
  },
});

export const upload = multer({ storage });
