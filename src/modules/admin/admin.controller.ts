import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await AdminService.getAllUsers(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Users retrieved successfully", data, meta });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const role = Array.isArray(req.body.role) ? req.body.role[0] : req.body.role;
  const result = await AdminService.updateUserRole(req.user!.userId, id, role);
  sendResponse(res, { statusCode: 200, success: true, message: "User role updated successfully", data: result });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await AdminService.softDeleteUser(req.user!.userId, id);
  sendResponse(res, { statusCode: 200, success: true, message: "User deleted successfully", data: null });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardStats();
  sendResponse(res, { statusCode: 200, success: true, message: "Dashboard stats retrieved successfully", data: result });
});

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await AdminService.getAuditLogs(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Audit logs retrieved successfully", data, meta });
});

export const AdminController = { getAllUsers, updateUserRole, deleteUser, getDashboardStats, getAuditLogs };
