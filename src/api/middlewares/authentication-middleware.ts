import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.AUTH) {
    if (!req?.auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    next();
  } else {
    next();
  }
};
