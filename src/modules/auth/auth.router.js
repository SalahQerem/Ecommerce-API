import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import fileUpload, { fileTypes } from "../../utils/multer.js";
import {
  confirmEmail,
  deleteInvalidConfirm,
  resetPassword,
  getUsers,
  sendCode,
  signIn,
  signUp,
} from "./auth.controller.js";

const router = Router();

router.get("/getUsers", auth(["User"]), getUsers);

router.post(
  "/signup",
  fileUpload(fileTypes.image).single("image"),
  asyncHandler(signUp)
);

router.get("/confirm-email/:token", asyncHandler(confirmEmail));

router.post("/signin", asyncHandler(signIn));

router.patch("/send-code", asyncHandler(sendCode));

router.patch("/reset-password", asyncHandler(resetPassword));

router.delete("/invalid-confirm", asyncHandler(deleteInvalidConfirm));

export default router;
