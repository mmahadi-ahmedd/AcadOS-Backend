import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { PaymentValidation } from "./payment.validation";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/initiate", auth("STUDENT"), validateRequest(PaymentValidation.initiateValidation), PaymentController.initiatePayment);
// SSLCommerz posts to these as application/x-www-form-urlencoded redirects - no auth (gateway calls these, not the logged-in user)
router.post("/success/:tranId", PaymentController.handleSuccess);
router.post("/fail/:tranId", PaymentController.handleFail);
router.post("/cancel/:tranId", PaymentController.handleCancel);
router.post("/ipn", PaymentController.handleIpn);
router.get("/:id", auth("ADMIN", "STUDENT"), PaymentController.getPaymentById);

export const PaymentRoutes = router;
