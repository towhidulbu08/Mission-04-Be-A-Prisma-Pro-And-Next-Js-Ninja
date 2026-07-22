import { Request, Response } from "express";
import httpStatus from "http-status";
import { userServices } from "./user.services";

const registerUser = async (req: Request, res: Response) => {
  try {
    const userData = await userServices.registerUserIntoDB(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: {
        userData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to register user",
      error: (error as Error).message,
    });
  }
};

export const userController = {
  registerUser,
};
