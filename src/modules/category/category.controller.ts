import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import categoryService from "./category.service";
import response from "../../utils/response";
import { CategoryIdParam, CreateCategory, QueryCategory, UpdateCategory } from "./category.type";
import { AuthenticatedRequest } from "../user/user.type";


export default {
    categories: asyncHandler<{query: QueryCategory}>(
        async (req, res, next) => {

            const query = res.locals.query;

            const result = await categoryService.findAll(query);
            return response.pagination(
                res,
                result.data,
                result.meta,
                "Categories fetched successfully"
            )
        }
    ),

    create: asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const userId = req.user?.id

            const result = await categoryService.create(userId, req.body as CreateCategory);
            return response.created(
                res,
                result.data,
                "Category created successfully"
            )
        }
    ),

    update: asyncHandler<{params: CategoryIdParam}>(
        async (req: AuthenticatedRequest, res, next) => {
            const userId = req.user?.id
            const {categoryId} = res.locals.params
            const data = req.body as UpdateCategory

            const result = await categoryService.update(
                userId,
                categoryId,
                data
            )

            return response.success(
                res,
                result.data,
                "Category updated successfully"
            )
        }
    ),

    detail: asyncHandler<{params: CategoryIdParam}>(
        async (req, res, next) => {
            const {categoryId} = res.locals.params;

            const result = await categoryService.detail(categoryId);
            return response.success(
                res,
                result.data,
                "Category detail fetched successfully"
            )
        }
    ),

    delete: asyncHandler<{params: CategoryIdParam}>(
        async (req: AuthenticatedRequest, res, next) => {
            const {categoryId} = res.locals.params;
            const userId = req.user?.id;

            const result = await categoryService.delete(userId, categoryId);
            return response.success(
                res,
                result.data,
                "Category deleted successfully"
            )
        }
    )

}