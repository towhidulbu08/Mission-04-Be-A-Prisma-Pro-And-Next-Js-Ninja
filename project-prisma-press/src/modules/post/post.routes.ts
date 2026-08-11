import { Router } from "express";
import { Role } from "../../../generated/prisma/browser";
import { auth } from "../../middlewares/auth";
import { postController } from "./post.controller";
auth;

const router = Router();

router.get("/", postController.getAllPosts); //public

router.get("/stats", auth(Role.ADMIN), postController.getPostsStats);
//admin only

router.get(
  "/my-posts",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.getMyPosts,
); //Authenticated user or Admin

router.get("/:postId", postController.getSinglePost); //public

router.post(
  "/",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.createPosts,
); //Authenticated user or Admin

router.patch(
  "/:postId",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.updatePost,
); //Authenticated user or Admin

router.delete(
  "/:postId",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.deletePost,
); //Authenticated user or Admin

export const postRoutes = router;
