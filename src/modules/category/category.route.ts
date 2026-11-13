import express from "express";
import validateRequest from "../../middlewares/validateReq.middleware";
import validateQuery from "../../middlewares/validateQuery.middleware";
import validateParam from "../../middlewares/validateParam.middleware";
import aclMiddleware from "../../middlewares/acl.middleware";
import categoryController from "./category.controller";
import {createCategorySchema, queryCategorySchema, updateCategorySchema, categoryIdParamSchema} from "./category.schema";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../utils/constant";

const router = express.Router();

router.get("/", validateQuery(queryCategorySchema),categoryController.categories);
router.post("/", [auth ,aclMiddleware([ROLES.ADMIN]),validateRequest(createCategorySchema)], categoryController.create);
router.put("/:categoryId", [auth ,aclMiddleware([ROLES.ADMIN]),validateParam(categoryIdParamSchema),validateRequest(updateCategorySchema)], categoryController.update);
router.get("/:categoryId", validateParam(categoryIdParamSchema), categoryController.detail);
router.delete("/:categoryId", [auth ,aclMiddleware([ROLES.ADMIN])], validateParam(categoryIdParamSchema), categoryController.delete);

export default router;