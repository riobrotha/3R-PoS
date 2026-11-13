import { hashPassword, comparePassword } from "../../utils/password";
import { RegisterUser, LoginUser } from './user.type';
import userRepository from "./user.repository";
import { UserRole } from "@prisma/client";
import { generateToken, generateRefreshToken } from "../../utils/jwt";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";


export default {
  async register(data: RegisterUser) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already in use", StatusCodes.CONFLICT);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || UserRole.CASHIER,
    });

    const { password, id, ...safeUser } = user;

    return {
      user: safeUser,
    }
  },

  async login({ email, password }: LoginUser) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const accessToken = generateToken({
      id: user.id,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      role: user.role
    });

    await userRepository.updateRefreshToken(user.id, refreshToken);

    const { password: __, id, refreshToken: _,    ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken
    }
  },

  async me(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    const { password, id, refreshToken, ...safeUser } = user;

    return {
      user: safeUser
    }
  },

  async refresh(userId: number, refreshToken: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    if (user.refreshToken !== refreshToken) {
      throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
    }

    const accessToken = generateToken({
      id: user.id,
      role: user.role
    });

    const newRefreshToken = generateRefreshToken({
      id: user.id,
      role: user.role
    });

    await userRepository.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken
    }
  }
}