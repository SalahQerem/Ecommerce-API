import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as cartController from "./cart.controller.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { endpoints } from "./cart.endPoint.js";
import * as validators from "./cart.validation.js";
import { validation } from "../../middleware/validation.js";

const router = Router();

router.get("/", auth(endpoints.get), asyncHandler(cartController.getCart));

router.post(
  "/",
  auth(endpoints.create),
  validation(validators.productIdValid),
  asyncHandler(cartController.addToCart)
);

router.put(
  "/clear-cart",
  auth(endpoints.clear),
  asyncHandler(cartController.clearCart)
);

router.put(
  "/:productId",
  auth(endpoints.delete),
  validation(validators.productIdValid),
  asyncHandler(cartController.removeFromCart)
);

router.put(
  "/update-quantity/:productId",
  auth(endpoints.update),
  validation(validators.updateQuantityvalid),
  asyncHandler(cartController.updateQuantity)
);

export default router;
