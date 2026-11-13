import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly error: null | string;


  constructor(message: string, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, error: null | string = null) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}
