import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

export const getDeviceInfo = (req: Request) => {
  const ua = new UAParser(req.headers['user-agent']);
  const device = ua.getDevice();
  const os = ua.getOS();
  const browser = ua.getBrowser();
  
  const deviceName = `${device.vendor || ''} ${device.model || ''} ${os.name || ''} ${os.version || ''} (${browser.name || ''})`.trim() || 'Unknown Device';
  
  return {
    deviceName,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown IP',
    userAgent: req.headers['user-agent'] || 'Unknown User Agent',
  };
};
