import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import response from "../utils/response";
import { MESSAGE } from "../constants/message";
import { StatusCodes } from "http-status-codes";
import { AppResponse } from "../types/response";

export default <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParsed = schema.parse(req.params);

      const typedRes = res as AppResponse<{ params: T }>;
      typedRes.locals.params = queryParsed;

    next();
    } catch (error) {
      if (error instanceof ZodError) {
        return response.error(
          res,
          MESSAGE.VALIDATION_ERROR,
          StatusCodes.BAD_REQUEST,
          error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        );
      }
      console.log(error);
      next(error);
    }
  };
};
