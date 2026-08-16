import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMsg = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMsg = "You Have Provided incorrect field type or missing field";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMsg = "Duplicate Key Error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMsg = "Foreign Key Constraint";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMsg =
        "An operation failed because it depends on one or more records that were required but not found. {cause}";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      errorMsg =
        "Authentication failed against database server. Please Check Your Credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMsg = "Can't reach database server";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMsg = "Error occurred during query execution";
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode,

    name: errorName,
    message: errorMsg,
    error: err.stack,
  });
};
export default globalErrorHandler;
