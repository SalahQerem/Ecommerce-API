import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import fileUpload, { fileTypes } from "../../utils/multer.js";
import {
  addSubCategory,
  deleteSubCategory,
  getActiveSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
} from "./subCategory.controller.js";
import { endPoint } from "./subCategory.endPoint.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileTypes.image).single("image"),
  asyncHandler(addSubCategory)
);

router.get("/", auth(endPoint.getAll), asyncHandler(getSubCategories));

router.get("/get-active/:id", asyncHandler(getActiveSubCategory));

router.get("/getById/:id", asyncHandler(getSubCategoryById));

router.patch(
  "/:id",
  auth(endPoint.update),
  fileUpload(fileTypes.image).single("image"),
  asyncHandler(updateSubCategory)
);

router.delete("/:id", auth(endPoint.delete), asyncHandler(deleteSubCategory));

export default router;
