import { Router } from "express";
import { Role } from "../../../generated/prisma/browser";
import { auth } from "../../middlewares/auth";
import { subscriptionController } from "./subscription.controller";

const router = Router();

router.post(
  "/checkout",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  subscriptionController.createCheckoutSession,
);

router.post("/webhook", subscriptionController.handleWebhook);

export const subscriptionRoutes = router;
