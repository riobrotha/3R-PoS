import { AuthenticatedRequest, LoginUser, RegisterUser, RefreshTokenRequest } from "./user.type";
import { StatusCodes } from "http-status-codes";
import { response } from "../../utils/response";
import userService from "./user.service";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

export default {
  register: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await userService.register(req.body as RegisterUser);

      return response.created(res, result, "User registered successfully");
    },
  ),

  login: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await userService.login(req.body as LoginUser);
      return response.success(res, result, "User logged in successfully");
    },
  ),

  me: asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userId = req.user?.id;
      if (!userId) {
        return response.error(
          res,
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "User not authenticated",
        );
      }

      const result = await userService.me(userId);
      return response.success(res, result, "User fetched successfully");
  }),


  refresh: asyncHandler(
    async (req: RefreshTokenRequest, res: Response, next: NextFunction) => {
      const userId = req.user?.id;
      const refreshToken = req.user?.refreshToken;

      console.log(req.user);

      if (!userId) {
        return response.error(
          res,
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "User not authenticated",
        );
      }

      if (!refreshToken) {
        return response.error(
          res,
          "Unauthorized",
          StatusCodes.UNAUTHORIZED,
          "Refresh token is missing",
        );
      }
      const result = await userService.refresh(userId, refreshToken);

      return response.success(res, result, "Token refreshed successfully");
  },)
};
