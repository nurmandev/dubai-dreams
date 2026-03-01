import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-long-secret-key-32-chars!!';

export class MfaService {
  static generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `OMNIS:${email}`,
    });
    
    // Encrypt the secret before returning it for storage
    const encryptedSecret = CryptoJS.AES.encrypt(secret.base32, ENCRYPTION_KEY).toString();
    
    return {
      otpauth_url: secret.otpauth_url,
      base32: secret.base32,
      encryptedSecret,
    };
  }

  static async generateQrCode(otpauthUrl: string): Promise<string> {
    return qrcode.toDataURL(otpauthUrl);
  }

  static verifyToken(token: string, encryptedSecret: string): boolean {
    const bytes = CryptoJS.AES.decrypt(encryptedSecret, ENCRYPTION_KEY);
    const secret = bytes.toString(CryptoJS.enc.Utf8);
    
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // Allow 30s drift
    });
  }
}
