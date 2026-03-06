import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwtToken.js";

export const protectRoutes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError(401, "Unauthorized: No token provided");
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      throw new AppError(401, "Unauthorized: Invalid token");
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    next(error);
  }
};