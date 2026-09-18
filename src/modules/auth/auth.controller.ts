import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import AppError from "../../utils/AppError";

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await AuthService.register(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "User registered successfully", data: user });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Logged in successfully", data: result });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await AuthService.refreshToken(refreshToken);
  sendResponse(res, { statusCode: 200, success: true, message: "Access token refreshed successfully", data: result });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "Not authorized");
  await AuthService.logout(req.user.userId);
  sendResponse(res, { statusCode: 200, success: true, message: "Logged out successfully", data: null });
});

export const AuthController = { register, login, refreshToken, logout };
