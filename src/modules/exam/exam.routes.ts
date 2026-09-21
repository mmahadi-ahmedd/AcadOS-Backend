import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { ExamValidation } from "./exam.validation";
import { ExamController } from "./exam.controller";

const router = Router();

router.post("/", auth("INSTRUCTOR"), validateRequest(ExamValidation.createValidation), ExamController.createExam);
router.get("/section/:sectionId", auth("ADMIN", "INSTRUCTOR", "STUDENT"), ExamController.getSectionExams);
router.get("/:id", auth("ADMIN", "INSTRUCTOR", "STUDENT"), ExamController.getExamById);

export const ExamRoutes = router;
