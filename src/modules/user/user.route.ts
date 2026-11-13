import express from "express";
import validateRequest from "../../middlewares/validateReq.middleware";
import auth from "../../middlewares/auth.middleware";
import refreshToken from "../../middlewares/refreshToken.middleware"
import userController from "./user.controller";
import { createUserSchema, loginUserSchema } from "./user.schema";

const router = express.Router();


router.post("/register", validateRequest(createUserSchema), userController.register);
router.post("/login",validateRequest(loginUserSchema), userController.login);
router.get("/me",auth, userController.me);
router.post("/refresh", refreshToken, userController.refresh);
export default router;