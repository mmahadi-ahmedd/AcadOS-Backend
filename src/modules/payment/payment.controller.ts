import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initiatePayment(req.user!.userId, req.body.feeId);
  sendResponse(res, { statusCode: 200, success: true, message: "Payment session initiated", data: result });
});

const handleSuccess = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.handleSuccess(req.params.tranId as string);
  sendResponse(res, { statusCode: 200, success: true, message: "Payment completed successfully", data: result });
});

const handleFail = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.handleFail(req.params.tranId as string);
  sendResponse(res, { statusCode: 200, success: false, message: "Payment failed", data: result });
});

const handleCancel = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.handleCancel(req.params.tranId as string);
  sendResponse(res, { statusCode: 200, success: false, message: "Payment cancelled", data: result });
});

const handleIpn = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.handleIpn(req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "IPN processed", data: result });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await PaymentService.getPaymentById(id);
  sendResponse(res, { statusCode: 200, success: true, message: "Payment retrieved successfully", data: result });
});

export const PaymentController = { initiatePayment, handleSuccess, handleFail, handleCancel, handleIpn, getPaymentById };
