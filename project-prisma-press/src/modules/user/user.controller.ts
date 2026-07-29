import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import { jwtUtils } from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.services";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userData = await userServices.registerUserIntoDB(payload);

    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   statusCode: httpStatus.CREATED,
    //   message: "User registered successfully",
    //   data: {
    //     userData,
    //   },
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: userData,
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    // console.log(accessToken);

    const verifyToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );

    const profile = await userServices.getMyProfileFromDB(verifyToken.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile fetched successfully",
      data: profile,
    });
  },
);
export const userController = {
  registerUser,
  getMyProfile,
};
