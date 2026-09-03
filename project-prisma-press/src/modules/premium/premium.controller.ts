import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { premiumServices } from "./premium.service";

import httpStatus from "http-status";

const getPremiumContent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await premiumServices.getPremiumContent(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Premium content retrived successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

export const premiumController = {
  getPremiumContent,
};
