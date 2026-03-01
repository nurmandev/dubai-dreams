import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface TokenPayload {
  userId: string;
  sessionId: string;
}

export class JwtService {
  private static readonly ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  private static readonly ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
  private static readonly REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: this.ACCESS_EXPIRY as any });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: this.REFRESH_EXPIRY as any });
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.ACCESS_SECRET) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.REFRESH_SECRET) as TokenPayload;
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
