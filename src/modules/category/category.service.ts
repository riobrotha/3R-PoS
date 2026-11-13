import { Prisma } from "@prisma/client";
import categoryRepository from "./category.repository";
import { CategoryIdParam, CreateCategory, QueryCategory, UpdateCategory } from "./category.type";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

export default {
  async findAll(query: QueryCategory) {
    const { page, limit, search, isActive } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [categories, totalData] = await Promise.all([
      categoryRepository.findAll(where, { createdAt: "desc" }, skip, limit),
      categoryRepository.count(where),
    ]);

    const totalPage = Math.ceil(totalData / limit);
    const dataCategories = categories.map(({ _count, ...category }) => ({
      ...category,
      productCount: _count.products,
    }));

    return {
      data: dataCategories,
      meta: {
        page,
        limit,
        totalData,
        totalPage,
      },
    };
  },

  async create(userId: number | undefined | null, data: CreateCategory) {
    const categoryName = data.name;
    const existingCategory = await categoryRepository.findByName(categoryName);

    if (existingCategory) {
      throw new AppError(
        "Category already exists, please use another one",
        StatusCodes.CONFLICT,
        "You can't create the same category name",
      );
    }

    const category = await categoryRepository.create({
      createdBy: userId,
      ...data,
    });
    return {
      data: category,
    };
  },

  async update(
    userId: number | undefined | null,
    categoryId: CategoryIdParam,
    data: UpdateCategory,
  ) {
    const existingCategory = await categoryRepository.findById(categoryId);

    if (!existingCategory) {
      throw new AppError(
        "Category not found",
        StatusCodes.NOT_FOUND,
        "The category you are trying to update does not exist",
      );
    }

    const updatedCategory = await categoryRepository.update(categoryId, {
      updatedBy: userId,
      ...data,
    });
    return {
      data: updatedCategory,
    };
  },

  async detail(categoryId: CategoryIdParam) {
    console.log("ini categoryId", categoryId);
    if (!categoryId) {
      throw new AppError(
        "Category ID is required",
        StatusCodes.BAD_REQUEST,
        "Please provide a category ID to fetch details",
      );
    }

    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError(
        "Category not found",
        StatusCodes.NOT_FOUND,
        "The category you are trying to access does not exist",
      );
    }

    return {
      data: category,
    };
  },

  async delete(userId: number | undefined | null, categoryId: number) {
    const existingCategory = await categoryRepository.findById(categoryId);

    if (!existingCategory) {
      throw new AppError(
        "Category not found",
        StatusCodes.NOT_FOUND,
        "The category you are trying to delete does not exist",
      );
    }


    if (userId === undefined || userId === null) {
      throw new AppError(
        "User ID is required for deletion",
        StatusCodes.BAD_REQUEST,
        "Please provide a valid user ID to delete the category",
      );
    }

    const deletedCategory = await categoryRepository.softDelete(categoryId, userId);
    return {
      data: deletedCategory,
    };
  }
};
