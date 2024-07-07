import { Router } from "express";
import { addCoupon } from "./coupon.controller.js";
import { auth } from "../../middleware/auth.js";
import * as couponController from "./coupon.controller.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { endPoint } from "./coupon.endPoint.js";
import { validation } from "../../middleware/validation.js";
import { CreateCoupon } from "./coupon.validation.js";
const router = Router();

router.post(
  "/",
  auth(endPoint.create),
  validation(CreateCoupon),
  asyncHandler(couponController.addCoupon)
);

export default router;
