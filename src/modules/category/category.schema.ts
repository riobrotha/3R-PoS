import {z} from "zod";


export const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export const queryCategorySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    isActive: z.enum(["true", "false"]).transform((val) => val === "true").optional(),
});

export const categoryIdParamSchema = z.object({
    categoryId: z.coerce.number().int().positive(),
});
