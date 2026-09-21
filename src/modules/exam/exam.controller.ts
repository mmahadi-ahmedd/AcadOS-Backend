import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ExamService } from "./exam.service";

const createExam = catchAsync(async (req: Request, res: Response) => {
  const result = await ExamService.createExam(req.user!.userId, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Exam created successfully", data: result });
});

const getSectionExams = catchAsync(async (req: Request, res: Response) => {
  const sectionId = String(req.params.sectionId);
  const result = await ExamService.getSectionExams(sectionId);
  sendResponse(res, { statusCode: 200, success: true, message: "Section exams retrieved successfully", data: result });
});

const getExamById = catchAsync(async (req: Request, res: Response) => {
  const examId = String(req.params.id);
  const result = await ExamService.getExamById(examId);
  sendResponse(res, { statusCode: 200, success: true, message: "Exam retrieved successfully", data: result });
});

export const ExamController = { createExam, getSectionExams, getExamById };
