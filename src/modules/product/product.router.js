import { Router } from "express";
import fileUpload, { fileTypes } from "../../utls/multer.js";
import * as productController from "./product.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./product.endPoint.js";
import { AddProduct, getProducts } from "./product.controller.js";
import reviewRouter from "./../review/review.router.js";
import { validation } from "../../middleware/validation.js";
import { createproduct } from "./product.validation.js";
import { asyncHandler } from "../../utls/errorHandling.js";
const router = Router();

router.use("/:productId/review", reviewRouter);

router.get("/", productController.getProducts);

router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileTypes.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  validation(createproduct),
  asyncHandler(productController.AddProduct)
);

export default router;
