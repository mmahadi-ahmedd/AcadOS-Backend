import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
