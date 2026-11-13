import { Request, Response, NextFunction } from "express";
import { response } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (err instanceof AppError) {
    return response.error(
      res,
      err.message,
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.error,
    );
  }

  if (err instanceof JsonWebTokenError) {
    return response.error(
      res,
      "Unauthorized",
      StatusCodes.UNAUTHORIZED,
      "Unauthorized due to invalid token (" + err.message + ")",
    );
  }


  return response.error(
    res,
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    err.message || "Internal Server Error",
    err.error,
  );
};
