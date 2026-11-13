import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { CategoryIdParam, CreateCategory, UpdateCategory } from "./category.type";
import { categorySelect } from "./category.select";

export default {
  findAll: (
    where: Prisma.CategoryWhereInput,
    orderBy?: Prisma.CategoryOrderByWithRelationInput,
    skip?: number,
    take?: number,
  ) => {
    return prisma.category.findMany({
      where: {
        deletedAt: null,
        ...where,
      },
      select: categorySelect,
      orderBy,
      skip,
      take,
    });
  },

  count: (where: Prisma.CategoryWhereInput) => {
    return prisma.category.count({
      where: {
        deletedAt: null,
        ...where,
      },
    });
  },

  create: (data: CreateCategory) => {
    return prisma.category.create({
      data,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },

  findByName: (categoryName: string) => {
    return prisma.category.findFirst({
      where: {
        name: categoryName,
        deletedAt: null,
      },
      select: categorySelect,
    });
  },

  findById: (categoryId: CategoryIdParam) => {
    return prisma.category.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      select: categorySelect,
    });
  },

  update: (categoryId: CategoryIdParam, data: UpdateCategory) => {
    return prisma.category.update({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      data,
      select: categorySelect,
    })
  },

  softDelete: (categoryId: CategoryIdParam, userId: number) => {
    return prisma.category.update({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      }
    })
  }
}
