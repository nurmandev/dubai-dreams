import { Request, Response, NextFunction } from 'express';

export const validate = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body);
    return next();
  } catch (error: any) {
    return res.status(400).json({ errors: error.errors });
  }
};
