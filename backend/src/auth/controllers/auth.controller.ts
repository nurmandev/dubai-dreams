import { Request, Response } from "express";
import User from "../../models/User";
import { AuthService } from "../services/auth.service";
import { JwtService } from "../tokens/jwt.service";
import { MfaService } from "../../utils/mfa";
import { sendEmail, emailTemplates } from "../../utils/email";
import { getDeviceInfo } from "../../utils/session";
import crypto from "crypto";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const deviceInfo = getDeviceInfo(req);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new User({ name, email, password });
      await user.save();

      await AuthService.logSecurityEvent(
        user.id,
        "REGISTER",
        deviceInfo,
        "success",
      );

      // Auto-generate tokens for immediate login after registration (since verification is disabled)
      const sessionId = JwtService.generateSessionId();
      const accessToken = JwtService.generateAccessToken({
        userId: user.id,
        sessionId,
      });
      const refreshToken = JwtService.generateRefreshToken({
        userId: user.id,
        sessionId,
      });

      // Save session
      user.sessions.push({
        sessionId,
        refreshTokenHash: JwtService.hashToken(refreshToken),
        device: deviceInfo.deviceName,
        ip: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        lastActive: new Date(),
      });
      await user.save();

      res.status(201).json({
        message: "User registered successfully! Redirecting...",
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password, mfaToken } = req.body;
      const deviceInfo = getDeviceInfo(req);

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check account lock
      if (user.lockUntil && user.lockUntil > new Date()) {
        return res
          .status(403)
          .json({ message: "Account locked. Try again later." });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins lock
        }
        await user.save();
        await AuthService.logSecurityEvent(
          user.id,
          "LOGIN_FAIL",
          deviceInfo,
          "failure",
          "Invalid password",
        );
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Reset failed attempts
      user.failedLoginAttempts = 0;
      user.lockUntil = undefined;

      // MFA Check
      if (user.isMfaEnabled) {
        if (!mfaToken) {
          return res
            .status(200)
            .json({ mfaRequired: true, message: "MFA token required" });
        }
        const isMfaValid = MfaService.verifyToken(mfaToken, user.mfaSecret!);
        if (!isMfaValid) {
          await AuthService.logSecurityEvent(
            user.id,
            "MFA_FAIL",
            deviceInfo,
            "failure",
          );
          return res.status(401).json({ message: "Invalid MFA token" });
        }
      }

      // Generate Tokens
      const sessionId = JwtService.generateSessionId();
      const accessToken = JwtService.generateAccessToken({
        userId: user.id,
        sessionId,
      });
      const refreshToken = JwtService.generateRefreshToken({
        userId: user.id,
        sessionId,
      });

      // Save session
      user.sessions.push({
        sessionId,
        refreshTokenHash: JwtService.hashToken(refreshToken),
        device: deviceInfo.deviceName,
        ip: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        lastActive: new Date(),
      });

      await user.save();
      await AuthService.logSecurityEvent(
        user.id,
        "LOGIN_SUCCESS",
        deviceInfo,
        "success",
      );

      // Notify if new device — fire-and-forget so mail failure doesn't break login
      const isNewDevice = !user.sessions.some(
        (s: any) =>
          s.device === deviceInfo.deviceName && s.sessionId !== sessionId,
      );
      if (isNewDevice) {
        sendEmail(
          user.email,
          "New Login Detected",
          emailTemplates.newDeviceLogin(deviceInfo.deviceName, deviceInfo.ip),
        ).catch((err) =>
          console.error("[Email] New device email failed:", err.message),
        );
      }

      res.status(200).json({ accessToken, refreshToken });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const deviceInfo = getDeviceInfo(req);

      const decoded = JwtService.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const sessionIndex = user.sessions.findIndex(
        (s: any) => s.sessionId === decoded.sessionId,
      );
      if (sessionIndex === -1)
        return res.status(401).json({ message: "Session invalid" });

      const incomingTokenHash = JwtService.hashToken(refreshToken);
      if (user.sessions[sessionIndex].refreshTokenHash !== incomingTokenHash) {
        // Token reuse detected! Revoke all sessions for security
        user.sessions = [];
        await user.save();
        await AuthService.logSecurityEvent(
          user.id,
          "TOKEN_REUSE_DETECTED",
          deviceInfo,
          "failure",
        );
        return res
          .status(401)
          .json({ message: "Token reuse detected. All sessions revoked." });
      }

      // Rotate Refresh Token
      const newSessionId = JwtService.generateSessionId();
      const newAccessToken = JwtService.generateAccessToken({
        userId: user.id,
        sessionId: newSessionId,
      });
      const newRefreshToken = JwtService.generateRefreshToken({
        userId: user.id,
        sessionId: newSessionId,
      });

      user.sessions[sessionIndex] = {
        sessionId: newSessionId,
        refreshTokenHash: JwtService.hashToken(newRefreshToken),
        device: deviceInfo.deviceName,
        ip: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        lastActive: new Date(),
      };

      await user.save();
      res
        .status(200)
        .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error: any) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  }

  static async setupMfa(req: Request, res: Response) {
    try {
      const user = await User.findById((req as any).user.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const mfa = MfaService.generateSecret(user.email);
      user.mfaSecret = mfa.encryptedSecret;
      await user.save();

      const qrCode = await MfaService.generateQrCode(mfa.otpauth_url!);
      res.status(200).json({ qrCode, secret: mfa.base32 });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async verifyMfaAndEnable(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const user = await User.findById((req as any).user.userId);
      if (!user || !user.mfaSecret)
        return res.status(400).json({ message: "MFA not setup" });

      const isValid = MfaService.verifyToken(token, user.mfaSecret);
      if (isValid) {
        user.isMfaEnabled = true;
        await user.save();
        await AuthService.logSecurityEvent(
          user.id,
          "MFA_ENABLED",
          getDeviceInfo(req),
          "success",
        );
        res.status(200).json({ message: "MFA enabled successfully" });
      } else {
        res.status(400).json({ message: "Invalid token" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const { sessionId } = (req as any).user;
      const user = await User.findById((req as any).user.userId);
      if (user) {
        user.sessions = user.sessions.filter(
          (s: any) => s.sessionId !== sessionId,
        );
        await user.save();
      }
      res.status(200).json({ message: "Logged out" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async logoutAll(req: Request, res: Response) {
    try {
      const user = await User.findById((req as any).user.userId);
      if (user) {
        user.sessions = [];
        await user.save();
      }
      res.status(200).json({ message: "Logged out from all devices" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async disableMfa(req: Request, res: Response) {
    try {
      const { password } = req.body;
      const user = await User.findById((req as any).user.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      user.isMfaEnabled = false;
      user.mfaSecret = undefined;
      await user.save();

      await AuthService.logSecurityEvent(
        user.id,
        "MFA_DISABLED",
        getDeviceInfo(req),
        "success",
      );
      res.status(200).json({ message: "MFA disabled" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
