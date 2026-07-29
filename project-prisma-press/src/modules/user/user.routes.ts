import { NextFunction, Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../../generated/prisma/browser";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import catchAsync from "../../utils/catchAsync";
import { jwtUtils } from "../../utils/jwt";
import { userController } from "./user.controller";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

const router = Router();

router.post("/register", userController.registerUser);

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to access this resource. ",
      );
    }

    const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifyToken.success) {
      throw new Error(verifyToken.error);
    }

    const { id, email, name, role } = verifyToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource.",
      );
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
        email,
        name,
        role,
      },
    });
    if (!user) {
      throw new Error("User not found. Please log in again");
    }

    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account has been blocked. Please contact support");
    }

    req.user = {
      email,
      name,
      id,
      role,
    };
    next();
  });
};

router.get(
  "/me",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  userController.getMyProfile,
);

export const userRoutes = router;
