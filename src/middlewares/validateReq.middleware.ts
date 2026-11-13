import { NextFunction, Request, Response } from "express";
import {  ZodError, ZodType } from "zod";
import { response } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { MESSAGE } from "../constants/message";

export default <T>(schema: ZodType<T>) => {

  if (!schema) {
    throw new Error("Validation schema is required");
  }

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return response.error(
          res,
          MESSAGE.VALIDATION_ERROR,
          StatusCodes.BAD_REQUEST,
          error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          }))
        )
      }
      console.log(error);
      return next(error);
    }
  }
}