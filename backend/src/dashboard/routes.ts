import { Router } from "express";
import { DashboardController } from "./controllers/dashboard.controller";
import { authenticate } from "../auth/middlewares/auth.middleware";

const router = Router();

// All dashboard routes are protected — require a valid JWT
router.use(authenticate);

// GET /api/dashboard/stats   — summary cards
router.get("/stats", DashboardController.getStats);

// GET /api/dashboard/views-chart   — 7-day bar chart data
router.get("/views-chart", DashboardController.getViewsChart);

// GET /api/dashboard/recent-messages   — activity feed / recent messages
router.get("/recent-messages", DashboardController.getRecentMessages);

// GET /api/dashboard/properties   — paginated property list
router.get("/properties", DashboardController.getProperties);

import { PropertyController } from "./controllers/property.controller";
import { upload } from "../middlewares/upload.middleware";

// POST /api/dashboard/properties — create a new property
router.post(
  "/properties",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "floorPlans", maxCount: 5 },
  ]),
  PropertyController.createProperty,
);

// PATCH /api/dashboard/properties/:id — update a property
router.patch(
  "/properties/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "floorPlans", maxCount: 5 },
  ]),
  PropertyController.updateProperty,
);

// DELETE /api/dashboard/properties/:id — delete a property
router.delete("/properties/:id", PropertyController.deleteProperty);

export default router;
