import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as categoryController from "./category.controller.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import fileUpload, { fileTypes } from "../../utls/multer.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";
import * as validators from "./category.validation.js";
import { validation } from "../../middleware/validation.js";

import { endPoint } from "./category.endPoint.js";

const router = Router();

router.use("/:categoryId/sub-category", subCategoryRouter);

router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.createCategory),
  asyncHandler(categoryController.AddCategory)
);

router.get(
  "/",
  auth(endPoint.getAll),
  asyncHandler(categoryController.getCategories)
);

router.get(
  "/active-categories",
  asyncHandler(categoryController.getActiveCategories)
);

router.get(
  "/:id",
  validation(validators.Categoryid),
  asyncHandler(categoryController.getCategoryById)
);

router.patch(
  "/:id",
  auth(endPoint.update),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.updateCategory),
  asyncHandler(categoryController.updateCategory)
);

router.delete(
  "/:id",
  auth(endPoint.delete),
  validation(validators.Categoryid),
  asyncHandler(categoryController.deleteCategory)
);

export default router;
