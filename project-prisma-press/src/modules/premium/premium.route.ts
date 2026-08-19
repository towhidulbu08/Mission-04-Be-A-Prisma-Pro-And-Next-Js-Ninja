import { Router } from "express";
import { Role } from "../../../generated/prisma/browser";
import { auth } from "../../middlewares/auth";
import { premiumController } from "./premium.controller";

const router = Router();
router.get(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  premiumController.getPremiumContent,
);

export const premiumRoutes = router;
