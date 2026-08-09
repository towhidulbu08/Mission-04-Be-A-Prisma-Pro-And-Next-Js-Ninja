import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./post.services";

import httpStatus from "http-status";

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostFromDB();
    sendResponse(res, {
      success: true,
      message: "Posts Retrived Successfully",
      data: result,
      statusCode: httpStatus.OK,
    });
  },
);
const getPostsWithStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostFromDB();
  },
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostFromDB();
  },
);
const getSinglePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostFromDB();
  },
);

const createPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id as string;
    const result = await postService.createPostIntoDB(req.body, id);

    sendResponse(res, {
      success: true,
      message: "Post Created SuccessFully",
      data: result,
      statusCode: httpStatus.CREATED,
    });
  },
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostFromDB();
  },
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostFromDB();
  },
);

export const postController = {
  getAllPosts,
  getMyPosts,
  getPostsWithStats,
  getSinglePost,
  createPosts,
  updatePost,
  deletePost,
};
