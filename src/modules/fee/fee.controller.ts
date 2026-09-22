import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FeeService } from "./fee.service";

const generateFee = catchAsync(async (req: Request, res: Response) => {
  const result = await FeeService.generateFee(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Fee generated successfully", data: result });
});

const getMyFees = catchAsync(async (req: Request, res: Response) => {
  const result = await FeeService.getMyFees(req.user!.userId);
  sendResponse(res, { statusCode: 200, success: true, message: "Your fees retrieved successfully", data: result });
});

const getAllFees = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await FeeService.getAllFees(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Fees retrieved successfully", data, meta });
});

const getFeeById = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await FeeService.getFeeById(id);
  sendResponse(res, { statusCode: 200, success: true, message: "Fee retrieved successfully", data: result });
});

export const FeeController = { generateFee, getMyFees, getAllFees, getFeeById };
