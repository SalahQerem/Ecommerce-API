import { Router } from "express";
import * as orderController from "./order.controller.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import * as validators from "./order.validation.js";
import { validation } from "../../middleware/validation.js";

import { endpoints } from "./order.endPoint.js";

const router = Router();

router.post(
  "/",
  auth(endpoints.create),
  validation(validators.createOrder),
  asyncHandler(orderController.addOrder)
);

router.get(
  "/",
  auth(endpoints.getAll),
  asyncHandler(orderController.getOrders)
);

router.get(
  "/user-orders",
  auth(endpoints.userOrders),
  asyncHandler(orderController.getUserOrders)
);

router.patch(
  "/:orderId",
  auth(endpoints.updateOrder),
  validation(validators.updateStatus),
  asyncHandler(orderController.changeStatus)
);
export default router;
