import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMe(req.user!.userId);
  sendResponse(res, { statusCode: 200, success: true, message: "Profile retrieved successfully", data: result });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateMe(req.user!.userId, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Profile updated successfully", data: result });
});

const createStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createStudentProfile(req.user!.userId, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Student profile created successfully", data: result });
});

const createInstructorProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createInstructorProfile(req.user!.userId, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Instructor profile created successfully", data: result });
});

export const UserController = { getMe, updateMe, createStudentProfile, createInstructorProfile };
