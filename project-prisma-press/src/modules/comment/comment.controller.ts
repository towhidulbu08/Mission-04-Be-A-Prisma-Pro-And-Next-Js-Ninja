import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { commentService } from "./comment.services";

const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId as string;
    if (!authorId) {
      throw new Error("Author Id Required In Params");
    }
    const result = await commentService.getCommentsByAuthorIdFromDB(authorId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments Retrived Successfully",
      data: result,
    });
  },
);

const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const result = await commentService.getCommentByCommentIdFromDB(commentId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Retrived Successfully",
      data: result,
    });
  },
);

const createComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const result = await commentService.createCommentIntoDB(authorId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Created Successfully",
      data: result,
    });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const authorId = req.user?.id as string;
    const result = await commentService.updateCommentIntoDB(
      commentId,
      req.body,
      authorId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Updated Successfully",
      data: result,
    });
  },
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const payload = req.body;
    const result = await commentService.moderateComment(
      commentId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment moderated successfully",
      data: result,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { commentId } = req.params;
    const authorId = user?.id as string;
    const result = await commentService.deleteCommentFromDB(
      commentId as string,
      authorId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment deleted successfully",
      data: result,
    });
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
