import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProgramService } from "./program.service";

const createProgram = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramService.createProgram(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Program created successfully", data: result });
});

const getAllPrograms = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await ProgramService.getAllPrograms(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Programs retrieved successfully", data, meta });
});

const getProgramById = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await ProgramService.getProgramById(id as string);
  sendResponse(res, { statusCode: 200, success: true, message: "Program retrieved successfully", data: result });
});

const updateProgram = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await ProgramService.updateProgram(id as string, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Program updated successfully", data: result });
});

const deleteProgram = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await ProgramService.softDeleteProgram(id as string);
  sendResponse(res, { statusCode: 200, success: true, message: "Program deleted successfully", data: null });
});

export const ProgramController = { createProgram, getAllPrograms, getProgramById, updateProgram, deleteProgram };
