import { NextFunction } from "express";
import { BadRequestException } from "../exception/bad-request.exception.js";

export const normalizeEmail = (email: string, next: NextFunction) => {
  const regex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  const isValid = regex.test(email);

  if (isValid) return email;

  return next(new BadRequestException("The email is not valid"));
};
