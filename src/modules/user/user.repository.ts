import { RegisterUser } from './user.type';
import prisma from "../../lib/prisma";

export default {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  findById: (id: number) => {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  updateRefreshToken(userId: number, refreshToken: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    });
  },

  create: (data: RegisterUser) => {
    return prisma.user.create({
      data
    });
  }
}