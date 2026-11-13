

import {createCategorySchema,queryCategorySchema,updateCategorySchema,categoryIdParamSchema} from "./category.schema";

export type CreateCategory = z.infer<typeof createCategorySchema>;
export type QueryCategory = z.infer<typeof queryCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;