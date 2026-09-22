import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CourseService } from "./course.service";

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Course created successfully", data: result });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await CourseService.getAllCourses(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Courses retrieved successfully", data, meta });
});

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await CourseService.getCourseById(String(id));
  sendResponse(res, { statusCode: 200, success: true, message: "Course retrieved successfully", data: result });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await CourseService.updateCourse(String(id), req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Course updated successfully", data: result });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await CourseService.softDeleteCourse(String(id));
  sendResponse(res, { statusCode: 200, success: true, message: "Course deleted successfully", data: null });
});

export const CourseController = { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };
