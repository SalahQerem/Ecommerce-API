import { Router } from "express";
import { addReview } from "./review.controller.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { endpoints } from "./review.endPoint.js";
import fileUpload, { fileTypes } from "../../utils/multer.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth(endpoints.create),
  fileUpload(fileTypes.image).single("image"),
  asyncHandler(addReview)
);

export default router;
