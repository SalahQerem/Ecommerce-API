import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { endpoints } from "./cart.endPoint.js";
import {
  clearCart,
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "./cart.controller.js";

const router = Router();

router.get("/", auth(endpoints.get), asyncHandler(getCart));

router.post("/", auth(endpoints.create), asyncHandler(addToCart));

router.put("/clearCart", auth(endpoints.clear), asyncHandler(clearCart));

router.put("/:productId", auth(endpoints.delete), asyncHandler(removeFromCart));

router.put(
  "/updateQuantity/:productId",
  auth(endpoints.update),
  asyncHandler(updateQuantity)
);

export default router;
