import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import AppError from "../utils/AppError";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: any[] = [];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    errors = err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    if (err.code === "P2002") {
      message = `Duplicate value for field: ${err.meta?.target}`;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Resource not found";
    } else {
      message = "Database error";
    }
    errors = [{ code: err.code, meta: err.meta }];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors ?? [];
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
