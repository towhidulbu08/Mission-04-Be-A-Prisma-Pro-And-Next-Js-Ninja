import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();

router.get("/", postController.getAllPosts); //public
router.get("/stats", postController.getPostsWithStats); //admin only
router.get("/my-posts", postController.getMyPosts); //Authenticated user or Admin
router.get("/:postId", postController.getSinglePost); //public

router.post("/", postController.createPosts); //Authenticated user or Admin

router.patch("/:postId", postController.updatePost); //Authenticated user or Admin
router.delete("/:postId", postController.deletePost); //Authenticated user or Admin

export const postRoutes = router;
