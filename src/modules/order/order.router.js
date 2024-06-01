import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import {
  changeStatus,
  addOrder,
  getUserOrders,
  getOrders,
} from "./order.controller.js";
import { endpoints } from "./order.endPoint.js";

const router = Router();

router.post("/", auth(endpoints.create), asyncHandler(addOrder));

router.get("/", auth(endpoints.getAll), asyncHandler(getOrders));

router.get(
  "/user-orders",
  auth(endpoints.userOrders),
  asyncHandler(getUserOrders)
);

router.patch(
  "/:orderId",
  auth(endpoints.updateOrder),
  asyncHandler(changeStatus)
);
export default router;
