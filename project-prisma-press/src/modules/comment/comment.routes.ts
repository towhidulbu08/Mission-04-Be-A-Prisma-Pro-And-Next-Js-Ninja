import { Router } from "express";
import { Role } from "../../../generated/prisma/browser";
import { auth } from "../../middlewares/auth";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/author/:authorId", commentController.getCommentByAuthorId); //public

router.get("/:commentId", commentController.getCommentByCommentId); //public

router.post("/", auth(Role.USER, Role.ADMIN), commentController.createComments); // User or Admin

router.patch(
  "/:commentId",
  auth(Role.USER, Role.ADMIN),
  commentController.updateComment,
); //Authenticated user or Admin

router.patch(
  "/:commentId/moderate",
  auth(Role.ADMIN),
  commentController.moderateComment,
); // Admin Only

router.delete(
  "/:commentId",
  auth(Role.USER, Role.ADMIN),
  commentController.deleteComment,
); //Authenticated user or Admin

export const commentRoutes = router;
