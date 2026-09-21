import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ResultService } from "./result.service";

const enterResults = catchAsync(async (req: Request, res: Response) => {
  const result = await ResultService.enterResults(req.user!.userId, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Results entered successfully", data: result });
});

const getMyResults = catchAsync(async (req: Request, res: Response) => {
  const result = await ResultService.getMyResults(req.user!.userId);
  sendResponse(res, { statusCode: 200, success: true, message: "Your results retrieved successfully", data: result });
});

const finalizeSectionGrades = catchAsync(async (req: Request, res: Response) => {
  const sectionIdParam = req.params.sectionId;
  const sectionId: string = Array.isArray(sectionIdParam) ? sectionIdParam[0] : sectionIdParam;
  const result = await ResultService.finalizeSectionGrades(req.user!.userId, sectionId);
  sendResponse(res, { statusCode: 200, success: true, message: "Section grades finalized successfully", data: result });
});

const getTranscript = catchAsync(async (req: Request, res: Response) => {
  const result = await ResultService.getTranscript(req.user!.userId);
  sendResponse(res, { statusCode: 200, success: true, message: "Transcript retrieved successfully", data: result });
});

export const ResultController = { enterResults, getMyResults, finalizeSectionGrades, getTranscript };
