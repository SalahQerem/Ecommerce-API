import { Router } from "express";
import { addCoupon } from "./coupon.controller.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { endPoint } from "./coupon.endPoint.js";

const router = Router();

router.post("/", auth(endPoint.create), asyncHandler(addCoupon));

export default router;
