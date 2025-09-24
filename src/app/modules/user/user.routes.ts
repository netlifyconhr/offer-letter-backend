import { Router } from "express";
import auth from "../../middleware/auth";
import clientInfoParser from "../../middleware/clientInfoParser";
import validateRequest from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { UserRole } from "./user.interface";
import { UserValidation } from "./user.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  UserController.getAllUser
);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN),
  UserController.myProfile
);

router.post(
  "/",
  clientInfoParser,
  validateRequest(UserValidation.userValidationSchema),
  UserController.registerUser
);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  UserController.updateUserStatus
);

export const UserRoutes = router;
