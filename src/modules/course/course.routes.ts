import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { CourseValidation } from "./course.validation";
import { CourseController } from "./course.controller";

const router = Router();

router.post("/", auth("ADMIN"), validateRequest(CourseValidation.createValidation), CourseController.createCourse);
router.get("/", auth("ADMIN", "INSTRUCTOR", "STUDENT"), CourseController.getAllCourses);
router.get("/:id", auth("ADMIN", "INSTRUCTOR", "STUDENT"), CourseController.getCourseById);
router.patch("/:id", auth("ADMIN"), validateRequest(CourseValidation.updateValidation), CourseController.updateCourse);
router.delete("/:id", auth("ADMIN"), CourseController.deleteCourse);

export const CourseRoutes = router;
