import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DepartmentService } from "./department.service";

const createDepartment = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentService.createDepartment(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Department created successfully", data: result });
});

const getAllDepartments = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await DepartmentService.getAllDepartments(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Departments retrieved successfully", data, meta });
});

const getDepartmentById = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentService.getDepartmentById(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Department retrieved successfully", data: result });
});

const updateDepartment = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentService.updateDepartment(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Department updated successfully", data: result });
});

const deleteDepartment = catchAsync(async (req: Request, res: Response) => {
  await DepartmentService.softDeleteDepartment(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Department deleted successfully", data: null });
});

export const DepartmentController = {
  createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment,
};
