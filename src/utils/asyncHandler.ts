import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppResponse } from "../types/response";


type AsyncHandler<TLocals extends Record<string, unknown>> = (
  req: Request,
  res: AppResponse<TLocals>,
  next: NextFunction
) => Promise<unknown> | unknown

export const asyncHandler =
  <TLocals extends Record<string, unknown>>(fn: AsyncHandler<TLocals>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res as AppResponse<TLocals>, next)).catch(next);
  };
