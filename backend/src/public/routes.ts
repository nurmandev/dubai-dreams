import { Router } from "express";
import { PublicController } from "./controllers/public.controller";

const router = Router();

// GET /api/public/properties
router.get("/properties", PublicController.getProperties);
router.get("/properties/:id", PublicController.getPropertyById);

// POST /api/public/inquiry (Contact Us)
router.post("/inquiry", PublicController.submitInquiry);

export default router;
