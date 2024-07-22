import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/error";

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({ status: 'error', message: err.message });
  } else {
    console.error("UNEXPECTED ERROR", err);
    res.status(500).json({ status: 'error', message: "An unexpected error occurred" });
  }
};

export const notFoundHandler = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ status: 'error', message: "Resource not found" });
};
