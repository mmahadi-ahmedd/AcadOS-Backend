import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { FeeValidation } from "./fee.validation";
import { FeeController } from "./fee.controller";

const router = Router();

router.post("/", auth("ADMIN"), validateRequest(FeeValidation.generateFeeValidation), FeeController.generateFee);
router.get("/", auth("ADMIN"), FeeController.getAllFees);
router.get("/my-fees", auth("STUDENT"), FeeController.getMyFees);
router.get("/:id", auth("ADMIN", "STUDENT"), FeeController.getFeeById);

export const FeeRoutes = router;
