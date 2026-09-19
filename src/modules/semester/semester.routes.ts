import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { SemesterValidation } from "./semester.validation";
import { SemesterController } from "./semester.controller";

const router = Router();

router.post("/", auth("ADMIN"), validateRequest(SemesterValidation.createValidation), SemesterController.createSemester);
router.get("/", auth("ADMIN", "INSTRUCTOR", "STUDENT"), SemesterController.getAllSemesters);
router.get("/:id", auth("ADMIN", "INSTRUCTOR", "STUDENT"), SemesterController.getSemesterById);
router.patch("/:id", auth("ADMIN"), validateRequest(SemesterValidation.updateValidation), SemesterController.updateSemester);
router.delete("/:id", auth("ADMIN"), SemesterController.deleteSemester);

export const SemesterRoutes = router;
