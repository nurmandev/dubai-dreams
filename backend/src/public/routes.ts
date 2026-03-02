import { Router } from "express";
import { PublicController } from "./controllers/public.controller";
import { BlogController } from "./controllers/blog.controller";

const router = Router();

// GET /api/public/properties
router.get("/properties", PublicController.getProperties);
router.get("/properties/:id", PublicController.getPropertyById);

// Blogs
router.get("/blogs", BlogController.getAllBlogs);
router.get("/blogs/:slug", BlogController.getBlogBySlug);

// POST /api/public/inquiry (Contact Us)
router.post("/inquiry", PublicController.submitInquiry);

export default router;
