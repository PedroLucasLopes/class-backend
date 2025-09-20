import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exception/http-exception.exception";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status || 500).json({
    status: error.status || 500,
    message: error.message || "Something went wrong",
    error: error.error,
  });
};
