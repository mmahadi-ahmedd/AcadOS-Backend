import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import catchAsync from "../utils/catchAsync";

const validateRequest = (schema: ZodObject<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
    next();
  });
};



export default validateRequest;
