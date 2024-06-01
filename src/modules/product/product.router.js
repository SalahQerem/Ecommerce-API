import { Router } from "express";
import fileUpload, { fileTypes } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./product.endPoint.js";
import { AddProduct, getProducts } from "./product.controller.js";

const router = Router();
router.get("/", getProducts);
router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileTypes.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  AddProduct
);

export default router;
