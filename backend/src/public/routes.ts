import { Router } from "express";
import { PublicController } from "./controllers/public.controller";
import { BlogController } from "./controllers/blog.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// GET /api/public/properties
router.get("/properties", PublicController.getProperties);
router.get("/properties/:id", PublicController.getPropertyById);
router.get("/stats", PublicController.getPublicStats);
router.get("/channels", PublicController.getChannels);

// Blogs
router.get("/blogs", BlogController.getAllBlogs);
router.get("/blogs/:slug", BlogController.getBlogBySlug);
router.get("/blogs/id/:id", BlogController.getBlogById);

// POST /api/public/inquiry (Contact Us)
router.post("/inquiry", PublicController.submitInquiry);

// POST /api/public/kyc
router.post(
  "/kyc",
  upload.fields([
    { name: "passportCopy", maxCount: 1 },
    { name: "emiratesIdCopy", maxCount: 1 },
    { name: "supportingDocuments", maxCount: 5 },
  ]),
  PublicController.submitKyc,
);

export default router;
