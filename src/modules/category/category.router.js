import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import fileUpload, { fileTypes } from "../../utils/multer.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";
import {
  AddCategory,
  deleteCategory,
  getActiveCategories,
  getCategories,
  getCategoryById,
  updateCategory,
} from "./category.controller.js";
import { endPoint } from "./category.endPoint.js";

const router = Router();

router.use("/:id/sub-category", subCategoryRouter);

router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileTypes.image).single("image"),
  asyncHandler(AddCategory)
);

router.get("/", auth(endPoint.getAll), asyncHandler(getCategories));

router.get("/active-category", asyncHandler(getActiveCategories));

router.get("/:id", asyncHandler(getCategoryById));

router.patch(
  "/:id",
  auth(endPoint.update),
  fileUpload(fileTypes.image).single("image"),
  asyncHandler(updateCategory)
);

router.delete("/:id", auth(endPoint.delete), asyncHandler(deleteCategory));

export default router;
