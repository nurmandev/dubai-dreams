import { Router } from "express";
import {
  getSDKStatus,
  getDevPayStatus,
  isDevPayPaid,
  hasDevPayFeature,
} from "../utils/devpay-guard";

const router = Router();

// SDK Status endpoint
router.get("/sdk-status", (req, res) => {
  const status = getSDKStatus();
  res.json({
    success: true,
    message: "DevPayGuard SDK Status",
    sdk: status,
    timestamp: new Date().toISOString(),
  });
});

// Payment status endpoint
router.get("/payment-status", (req, res) => {
  const paid = isDevPayPaid();
  const snapshot = getDevPayStatus();

  res.json({
    success: true,
    isPaid: paid,
    status: snapshot || "SDK not fully initialized",
    timestamp: new Date().toISOString(),
  });
});

// Feature access endpoint
router.post("/check-feature", (req, res) => {
  const { featureCode } = req.body;

  if (!featureCode) {
    return res.status(400).json({
      success: false,
      error: "featureCode is required",
    });
  }

  const hasAccess = hasDevPayFeature(featureCode);

  res.json({
    success: true,
    featureCode,
    hasAccess,
    timestamp: new Date().toISOString(),
  });
});

export default router;
