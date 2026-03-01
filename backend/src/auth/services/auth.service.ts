import User, { IUser } from '../../models/User';
import AuditLog from '../../models/AuditLog';
import { JwtService } from '../tokens/jwt.service';
import { MfaService } from '../../utils/mfa';
import { sendEmail, emailTemplates } from '../../utils/email';
import crypto from 'crypto';

export class AuthService {
  static async logSecurityEvent(userId: string | undefined, action: string, reqInfo: any, status: 'success' | 'failure', details?: string) {
    await AuditLog.create({
      userId,
      action,
      ip: reqInfo.ip,
      device: reqInfo.deviceName,
      userAgent: reqInfo.userAgent,
      status,
      details,
    });
  }

  static async clearExpiredSessions(user: IUser) {
    const now = new Date();
    // Assuming 7 days expiry for session tracking
    user.sessions = user.sessions.filter(s => {
      const expiry = new Date(s.lastActive);
      expiry.setDate(expiry.getDate() + 7);
      return expiry > now;
    });
  }
}
