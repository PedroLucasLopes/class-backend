import { NextFunction } from "express";
import { AuthRequest } from "../model/authrequest.model.js";
import { UnauthorizedException } from "../exception/unauthorized.exception.js";
import { verifyAccessToken } from "../utils/token.utils.js";
import { logger } from "../log/_logger.js";

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return next(new UnauthorizedException("Access token required"));
  try {
    const payload = verifyAccessToken(token);
    logger.info("Authenticating user", { userId: payload.userId });
    req.userId = payload.userId;
    return next();
  } catch (err) {
    logger.error("Something goes wrong on authentication this user", {
      error: err,
    });
    throw next(new UnauthorizedException("Invalid or required token"));
  }
};
