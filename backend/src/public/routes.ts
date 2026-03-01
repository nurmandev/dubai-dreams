import { Router } from "express";
import { PublicController } from "./controllers/public.controller";

const router = Router();

// GET /api/public/properties
router.get("/properties", PublicController.getProperties);
router.get("/properties/:id", PublicController.getPropertyById);

export default router;
