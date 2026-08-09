import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/author/:authorId", commentController.getAllComments); //public

router.get("/:commentId", commentController.getSingleComment); //public

router.post("/", commentController.createComments); // User or Admin

router.patch("/:commentId", commentController.updateComment); //Authenticated user or Admin
router.patch("/:commentId/moderate", commentController.updateComment); // Admin Only
router.delete("/:commentId", commentController.deleteComment); //Authenticated user or Admin

export const commentRoutes = router;
