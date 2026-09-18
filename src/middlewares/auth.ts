import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { verifyAccessToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string; email: string };
    }
  }
}

export const auth = (...allowedRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "You are not authorized. No token provided.");
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      throw new AppError(401, "Invalid or expired token.");
    }
    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      throw new AppError(403, "You do not have permission to access this resource.");
    }
    req.user = { userId: decoded.userId, role: decoded.role, email: decoded.email };
    next();
  });
};
