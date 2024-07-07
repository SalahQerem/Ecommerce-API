import { Router } from "express";
import { getUsers, getUserById } from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { endpoints } from "./user.endPoint.js";
import { asyncHandler } from "../../utls/errorHandling.js";

const router = Router();

router.get("/", auth(endpoints.getAll), asyncHandler(getUsers));

router.get("/by-id", auth(endpoints.getUser), asyncHandler(getUserById));

export default router;
