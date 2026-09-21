import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AttendanceService } from "./attendance.service";

const markAttendance = catchAsync(async (req: Request, res: Response) => {
  const result = await AttendanceService.markAttendance(req.user!.userId, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Attendance marked successfully", data: result });
});

const getSectionAttendance = catchAsync(async (req: Request, res: Response) => {
  const sectionId = Array.isArray(req.params.sectionId) ? req.params.sectionId[0] : req.params.sectionId;
  const result = await AttendanceService.getSectionAttendance(sectionId, req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Section attendance retrieved successfully", data: result });
});

const getMyAttendance = catchAsync(async (req: Request, res: Response) => {
  const result = await AttendanceService.getMyAttendance(req.user!.userId, req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Your attendance retrieved successfully", data: result });
});

export const AttendanceController = { markAttendance, getSectionAttendance, getMyAttendance };
