import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";

const router = Router();

router.get("/me", auth("ADMIN", "INSTRUCTOR", "STUDENT"), UserController.getMe);
router.patch("/me", auth("ADMIN", "INSTRUCTOR", "STUDENT"), validateRequest(UserValidation.updateMeValidation), UserController.updateMe);
router.post(
  "/me/student-profile",
  auth("STUDENT"),
  validateRequest(UserValidation.createStudentProfileValidation),
  UserController.createStudentProfile
);
router.post(
  "/me/instructor-profile",
  auth("INSTRUCTOR"),
  validateRequest(UserValidation.createInstructorProfileValidation),
  UserController.createInstructorProfile
);

export const UserRoutes = router;
