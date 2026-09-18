import { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API not found",
    errors: [{ path: req.originalUrl, message: "Route does not exist" }],
  });
};

export default notFound;
