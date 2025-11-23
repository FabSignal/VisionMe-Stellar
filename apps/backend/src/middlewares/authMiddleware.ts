// JWT Middleware
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface AuthRequest extends Request {
  userId?: string;
  stellarPublicKey?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    const token = authHeader.substring(7);
    const decoded: any = jwt.verify(token, ENV.JWT_SECRET as any);

    req.userId = decoded.userId;
    req.stellarPublicKey = decoded.stellarPublicKey;

    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
}
