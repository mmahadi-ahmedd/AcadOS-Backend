import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { SectionValidation } from "./section.validation";
import { SectionController } from "./section.controller";

const router = Router();

router.post("/", auth("ADMIN"), validateRequest(SectionValidation.createValidation), SectionController.createSection);
router.get("/", auth("ADMIN", "INSTRUCTOR", "STUDENT"), SectionController.getAllSections);
router.get("/my-sections", auth("INSTRUCTOR"), SectionController.getMySections);
router.get("/:id", auth("ADMIN", "INSTRUCTOR", "STUDENT"), SectionController.getSectionById);
router.patch("/:id", auth("ADMIN"), validateRequest(SectionValidation.updateValidation), SectionController.updateSection);
router.delete("/:id", auth("ADMIN"), SectionController.deleteSection);

export const SectionRoutes = router;
