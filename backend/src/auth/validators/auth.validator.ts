import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(12).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  mfaToken: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(12),
});

export const mfaVerifySchema = z.object({
  token: z.string().length(6),
});
