import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { DepartmentValidation } from "./department.validation";
import { DepartmentController } from "./department.controller";

const router = Router();

router.post("/", auth("ADMIN"), validateRequest(DepartmentValidation.createValidation), DepartmentController.createDepartment);
router.get("/", auth("ADMIN", "INSTRUCTOR", "STUDENT"), DepartmentController.getAllDepartments);
router.get("/:id", auth("ADMIN", "INSTRUCTOR", "STUDENT"), DepartmentController.getDepartmentById);
router.patch("/:id", auth("ADMIN"), validateRequest(DepartmentValidation.updateValidation), DepartmentController.updateDepartment);
router.delete("/:id", auth("ADMIN"), DepartmentController.deleteDepartment);

export const DepartmentRoutes = router;
