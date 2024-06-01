import { Router } from "express";
import fileUpload, { fileTypes } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./product.endPoint.js";
import { AddProduct, getproduct } from "./product.controller.js";

const router = Router();
router.get("/", getproduct);
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
