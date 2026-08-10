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
    const authorId = req.user?.id as string;
    const result = await postService.getMyPostsFromDB(authorId);
    sendResponse(res, {
      success: true,
      message: "My Posts Retrived Successfully",
      data: result,
      statusCode: httpStatus.OK,
    });
  },
);
const getSinglePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId as string;
    if (!postId) {
      throw new Error("Post Id Required In Params");
    }
    const result = await postService.getSinglePostFromDB(postId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Retrived Successfully",
      data: result,
    });
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
    const postId = req.params.postId as string;
    if (!postId) {
      throw new Error("Post Id Required In Params");
    }
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    const result = await postService.updatePostIntoDB(
      postId,
      req.body,
      authorId,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Updated Successfully",
      data: result,
    });
  },
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId as string;
    if (!postId) {
      throw new Error("Post Id Required In Params");
    }
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    await postService.deletePostFromDB(postId, authorId, isAdmin);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Deleted Successfully",
      data: null,
    });
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
