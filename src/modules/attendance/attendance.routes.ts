import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { AttendanceValidation } from "./attendance.validation";
import { AttendanceController } from "./attendance.controller";

const router = Router();

router.post("/", auth("INSTRUCTOR"), validateRequest(AttendanceValidation.markValidation), AttendanceController.markAttendance);
router.get("/my-attendance", auth("STUDENT"), AttendanceController.getMyAttendance);
router.get("/section/:sectionId", auth("ADMIN", "INSTRUCTOR"), AttendanceController.getSectionAttendance);

export const AttendanceRoutes = router;
