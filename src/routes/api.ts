import express from "express";
import { response } from "../utils/response";
import userRouter from "../modules/user/user.route";
import categoryRouter from "../modules/category/category.route";


const router = express.Router();

router.get("/home", (req, res) => {
  return response.success(res, null, "Hello, CashierKu Backend is running!");
});

router.use("/auth", userRouter);
router.use("/categories", categoryRouter);

export default router;