import { Request } from "express";
import { createUserSchema, loginUserSchema } from "./user.schema";

export type RegisterUser = z.infer<typeof createUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export interface AuthenticatedRequest extends Request {
  user?: {
    id?: number;
    role?: string;
  }
}

export interface RefreshTokenRequest extends Request {
  user?: {
    id?: number;
    role?: string;
    refreshToken?: string;
  },
}