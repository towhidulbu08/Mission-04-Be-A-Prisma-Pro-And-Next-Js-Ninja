import { NextFunction, Request, Response } from "express";
import { postService } from "./post.services";

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  const result = await postService.getAllPostFromDB();
};
const getPostsWithStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await postService.getPostsWithStatsFromDB();
};
const getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
  const result = await postService.getMyPostsFromDB();
};
const getSinglePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = Number(req.params.id);
  const result = await postService.getSinglePostFromDB(id);
};

const createPosts = async (req: Request, res: Response, next: NextFunction) => {
  const result = await postService.createPostIntoDB(req.body);
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const result = await postService.updatePostIntoDB(req.body);
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const result = await postService.deletePostFromDB(id);
};

export const postController = {
  getAllPosts,
  getMyPosts,
  getPostsWithStats,
  getSinglePost,
  createPosts,
  updatePost,
  deletePost,
};
