import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { EnrollmentValidation } from "./enrollment.validation";
import { EnrollmentController } from "./enrollment.controller";

const router = Router();

router.post("/", auth("STUDENT"), validateRequest(EnrollmentValidation.enrollValidation), EnrollmentController.enrollInSection);
router.get("/my-enrollments", auth("STUDENT"), EnrollmentController.getMyEnrollments);
router.patch("/:id/drop", auth("STUDENT"), EnrollmentController.dropEnrollment);
router.get("/section/:sectionId", auth("ADMIN", "INSTRUCTOR"), EnrollmentController.getSectionEnrollments);

export const EnrollmentRoutes = router;
