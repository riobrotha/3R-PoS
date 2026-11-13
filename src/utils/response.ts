import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MESSAGE } from "../constants/message";

export interface PaginationMeta {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
}

export const response = {
  success<T>(
    res: Response,
    data: T,
    message: string = MESSAGE.SUCCESS,
    statusCode = StatusCodes.OK
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  created<T>(
    res: Response,
    data: T,
    message: string = MESSAGE.CREATED,
  ) {
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message,
      data,
    });
  },

  error(
    res: Response,
    message: string = MESSAGE.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    errors: unknown = null
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  },

  pagination<T>(
    res: Response,
    data: T,
    meta: PaginationMeta,
    message: string = MESSAGE.SUCCESS,
    statusCode = StatusCodes.OK
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  },

  noContent(res: Response) {
    return res.status(StatusCodes.NO_CONTENT).send();
  },
};

export default response;