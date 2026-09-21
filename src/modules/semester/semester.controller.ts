import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterService } from "./semester.service";

const createSemester = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterService.createSemester(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Semester created successfully", data: result });
});

const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await SemesterService.getAllSemesters(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Semesters retrieved successfully", data, meta });
});

const getSemesterById = catchAsync(async (req: Request, res: Response) => {
  const semesterId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await SemesterService.getSemesterById(semesterId);
  sendResponse(res, { statusCode: 200, success: true, message: "Semester retrieved successfully", data: result });
});

const updateSemester = catchAsync(async (req: Request, res: Response) => {
  const semesterId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await SemesterService.updateSemester(semesterId, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Semester updated successfully", data: result });
});

const deleteSemester = catchAsync(async (req: Request, res: Response) => {
  const semesterId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await SemesterService.softDeleteSemester(semesterId);
  sendResponse(res, { statusCode: 200, success: true, message: "Semester deleted successfully", data: null });
});

export const SemesterController = { createSemester, getAllSemesters, getSemesterById, updateSemester, deleteSemester };
