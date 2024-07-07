import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as AuthController from "./auth.controller.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import fileUpload, { fileTypes } from "../../utls/multer.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./auth.validation.js";
const router = Router();

router.get("/get-user", auth(["User"]), asyncHandler(AuthController.getUser));

router.post(
  "/signup",
  checkEmail,
  validation(validators.RegisterSchema),
  asyncHandler(AuthController.signUp)
);
router.post(
  "/excel",
  fileUpload(fileTypes.excel).single("excel"),
  asyncHandler(AuthController.addUserExcel)
);
router.get("/confirm-email/:token", asyncHandler(AuthController.confirmEmail));

router.post(
  "/signin",
  validation(validators.LogInSchema),
  asyncHandler(AuthController.signIn)
);

router.patch(
  "/send-code",
  validation(validators.sendCodevalidation),
  asyncHandler(AuthController.sendCode)
);

router.patch(
  "/reset-password",
  validation(validators.forgotPasswordvalid),
  asyncHandler(AuthController.resetPassword)
);

router.delete(
  "/invalid-confirm",
  asyncHandler(AuthController.deleteInvalidConfirm)
);

export default router;
