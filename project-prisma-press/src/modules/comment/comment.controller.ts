import { NextFunction, Request, Response } from "express";
import { commentService } from "./comment.services";

const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await commentService.getAllPostFromDB();
};
const getCommentsWithStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await commentService.getCommentsWithStatsFromDB();
};
const getMyComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await commentService.getMyCommentsFromDB();
};
const getSingleComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = Number(req.params.id);
  const result = await commentService.getSingleCommentFromDB(id);
};

const createComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await commentService.createCommentIntoDB(req.body);
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await commentService.updateCommentIntoDB(req.body);
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = Number(req.params.id);
  const result = await commentService.deleteCommentFromDB(id);
};

export const commentController = {
  getAllComments,
  getMyComments,
  getCommentsWithStats,
  getSingleComment,
  createComments,
  updateComment,
  deleteComment,
};
