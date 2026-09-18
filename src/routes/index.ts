import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { DepartmentRoutes } from "../modules/department/department.routes";
import { ProgramRoutes } from "../modules/program/program.routes";
import { CourseRoutes } from "../modules/course/course.routes";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/departments", route: DepartmentRoutes },
  { path: "/programs", route: ProgramRoutes },
  { path: "/courses", route: CourseRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
