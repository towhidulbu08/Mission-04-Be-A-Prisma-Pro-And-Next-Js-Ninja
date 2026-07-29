import { NextFunction, Request, Response, Router } from "express";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/browser";
import config from "../../config";
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
router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const verifyToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );

    const { id, email, name, role } = verifyToken;

    const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];

    if (!requiredRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Forbidden! You dont have permision to access this resource",
      });
    }

    req.user = {
      email,
      name,
      id,
      role,
    };
    next();
  },
  userController.getMyProfile,
);

export const userRoutes = router;
