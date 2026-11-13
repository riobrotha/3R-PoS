import { NextFunction, Request, Response } from "express";
import { response } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { verifyRefreshToken } from "../utils/jwt";
import { RefreshTokenRequest } from "../modules/user/user.type";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers?.authorization;
  if (!authorization) {
    return response.error(
      res,
      "Unauthorized",
      StatusCodes.UNAUTHORIZED,
      "Authorization header is missing"
    );
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return response.error(
      res,
      "Unauthorized",
      StatusCodes.UNAUTHORIZED,
      "Invalid authorization format"
    );
  }

  //verify refresh token
  const user = verifyRefreshToken(token);
  if (!user) {
    return response.error(
      res,
      "Unauthorized",
      StatusCodes.UNAUTHORIZED,
      "Unauthorized due to invalid token"
    );
  }

  const userWithRefreshToken = {
    ...user,
    refreshToken: token,
  };

  //attach user to request
  (req as RefreshTokenRequest).user = userWithRefreshToken;

  next();
}