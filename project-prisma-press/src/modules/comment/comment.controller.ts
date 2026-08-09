import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { commentService } from "./comment.services";

const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await commentService.getAllPostFromDB();
  },
);

const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await commentService.getAllPostFromDB();
  },
);

const createComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await commentService.getAllPostFromDB();
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await commentService.getAllPostFromDB();
  },
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await commentService.getAllPostFromDB();
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await commentService.getAllPostFromDB();
  },
);

export const commentController = {
  getCommentByAuthorId,

  getCommentByCommentId,
  createComments,
  updateComment,
  deleteComment,
  moderateComment,
};
