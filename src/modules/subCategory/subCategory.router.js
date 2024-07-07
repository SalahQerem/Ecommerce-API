import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { endPoint } from "./subCategory.endPoint.js";
import fileUpload, { fileTypes } from "../../utls/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./subCategory.validation.js";
import * as subcategoryController from "./subcategory.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.createsubCategory),
  asyncHandler(subcategoryController.addSubCategory)
);

router.get(
  "/",
  auth(endPoint.getAll),
  asyncHandler(subcategoryController.getSubCategories)
);

router.get(
  "/get-active/:id",
  asyncHandler(subcategoryController.getActiveSubCategory)
);

router.get(
  "/getById/:id",
  validation(validators.validationid),
  asyncHandler(subcategoryController.getSubCategoryById)
);

router.patch(
  "/:id",
  auth(endPoint.update),
  fileUpload(fileTypes.image).single("image"),
  validation(validators.updateSub),
  asyncHandler(subcategoryController.updateSubCategory)
);

router.delete(
  "/:id",
  auth(endPoint.delete),
  validation(validators.validationid),
  asyncHandler(subcategoryController.deleteSubCategory)
);

export default router;
