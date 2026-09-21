import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrollmentService } from "./enrollment.service";

const enrollInSection = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.enrollInSection(req.user!.userId, req.body.sectionId);
  sendResponse(res, { statusCode: 201, success: true, message: "Enrolled successfully", data: result });
});

const dropEnrollment = catchAsync(async (req: Request, res: Response) => {
  const enrollmentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await EnrollmentService.dropEnrollment(req.user!.userId, enrollmentId);
  sendResponse(res, { statusCode: 200, success: true, message: "Enrollment dropped successfully", data: result });
});

const getMyEnrollments = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.getMyEnrollments(req.user!.userId, req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Your enrollments retrieved successfully", data: result });
});

const getSectionEnrollments = catchAsync(async (req: Request, res: Response) => {
  const sectionId = Array.isArray(req.params.sectionId) ? req.params.sectionId[0] : req.params.sectionId;
  const result = await EnrollmentService.getSectionEnrollments(sectionId);
  sendResponse(res, { statusCode: 200, success: true, message: "Section enrollments retrieved successfully", data: result });
});

export const EnrollmentController = {
  enrollInSection, dropEnrollment, getMyEnrollments, getSectionEnrollments,
};
