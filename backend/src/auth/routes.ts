import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";
import { ProfileController } from "./controllers/profile.controller";
import { authenticate } from "./middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  registerSchema,
  loginSchema,
  mfaVerifySchema,
} from "./validators/auth.validator";
import rateLimit from "express-rate-limit";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register requests per windowMs
  message: { message: "Too many requests, please try again after 15 minutes" },
});

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", authLimiter, validate(loginSchema), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);

// Profile routes
router.get("/profile", authenticate, ProfileController.getProfile);
router.put("/profile", authenticate, ProfileController.updateProfile);

// Protected routes
router.post("/logout", authenticate, AuthController.logout);
router.post("/mfa/setup", authenticate, AuthController.setupMfa);
router.post(
  "/mfa/verify",
  authenticate,
  validate(mfaVerifySchema),
  AuthController.verifyMfaAndEnable,
);

export default router;
