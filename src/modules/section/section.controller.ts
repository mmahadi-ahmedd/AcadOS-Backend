import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SectionService } from "./section.service";

const createSection = catchAsync(async (req: Request, res: Response) => {
  const result = await SectionService.createSection(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Section created successfully", data: result });
});

const getAllSections = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await SectionService.getAllSections(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Sections retrieved successfully", data, meta });
});

const getSectionById = catchAsync(async (req: Request, res: Response) => {
  const sectionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await SectionService.getSectionById(sectionId);
  sendResponse(res, { statusCode: 200, success: true, message: "Section retrieved successfully", data: result });
});

const getMySections = catchAsync(async (req: Request, res: Response) => {
  const result = await SectionService.getMySections(req.user!.userId);
  sendResponse(res, { statusCode: 200, success: true, message: "Your sections retrieved successfully", data: result });
});

const updateSection = catchAsync(async (req: Request, res: Response) => {
  const sectionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await SectionService.updateSection(sectionId, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Section updated successfully", data: result });
});

const deleteSection = catchAsync(async (req: Request, res: Response) => {
  const sectionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await SectionService.softDeleteSection(sectionId);
  sendResponse(res, { statusCode: 200, success: true, message: "Section deleted successfully", data: null });
});

export const SectionController = {
  createSection, getAllSections, getSectionById, getMySections, updateSection, deleteSection,
};
