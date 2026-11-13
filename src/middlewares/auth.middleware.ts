import { NextFunction, Request, Response } from "express";
import { response } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../modules/user/user.type";

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

  //verify token
  const user = verifyToken(token);
  console.log("user", user);
  if (!user) {
    return response.error(
      res,
      "Unauthorized",
      StatusCodes.UNAUTHORIZED,
      "Unauthorized due to invalid token"
    );
  }

  //attach user to request
  (req as AuthenticatedRequest).user = user;

  next();
}