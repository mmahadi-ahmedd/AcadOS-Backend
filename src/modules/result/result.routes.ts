import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { ResultValidation } from "./result.validation";
import { ResultController } from "./result.controller";

const router = Router();

router.post("/", auth("INSTRUCTOR"), validateRequest(ResultValidation.enterResultsValidation), ResultController.enterResults);
router.get("/my-results", auth("STUDENT"), ResultController.getMyResults);
router.get("/transcript", auth("STUDENT"), ResultController.getTranscript);
router.patch("/finalize/:sectionId", auth("INSTRUCTOR"), ResultController.finalizeSectionGrades);

export const ResultRoutes = router;
