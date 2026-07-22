import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.services";

import httpStatus from "http-status";
const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const loginResult = await authService.loginUser(payload);

    sendResponse(res, {
      success: true,
      message: "User logged in successfully ",
      statusCode: httpStatus.OK,
      data: loginResult,
    });
  },
);

export const authController = {
  loginUser,
};
