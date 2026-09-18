import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { ProgramValidation } from "./program.validation";
import { ProgramController } from "./program.controller";

const router = Router();

router.post("/", auth("ADMIN"), validateRequest(ProgramValidation.createValidation), ProgramController.createProgram);
router.get("/", auth("ADMIN", "INSTRUCTOR", "STUDENT"), ProgramController.getAllPrograms);
router.get("/:id", auth("ADMIN", "INSTRUCTOR", "STUDENT"), ProgramController.getProgramById);
router.patch("/:id", auth("ADMIN"), validateRequest(ProgramValidation.updateValidation), ProgramController.updateProgram);
router.delete("/:id", auth("ADMIN"), ProgramController.deleteProgram);

export const ProgramRoutes = router;
