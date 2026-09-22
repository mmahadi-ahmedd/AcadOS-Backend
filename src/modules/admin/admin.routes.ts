import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { AdminValidation } from "./admin.validation";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/users", auth("ADMIN"), AdminController.getAllUsers);
router.patch("/users/:id/role", auth("ADMIN"), validateRequest(AdminValidation.updateUserRoleValidation), AdminController.updateUserRole);
router.delete("/users/:id", auth("ADMIN"), AdminController.deleteUser);
router.get("/dashboard-stats", auth("ADMIN"), AdminController.getDashboardStats);
router.get("/audit-logs", auth("ADMIN"), AdminController.getAuditLogs);

export const AdminRoutes = router;
