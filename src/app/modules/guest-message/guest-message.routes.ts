import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { GuestMessageController } from "./guest-message.controller";

const router = Router();

router.get(
  "/contact-messages",
  auth(UserRole.SUPERADMIN),
  GuestMessageController.getContactMessages
);

router.post(
  "/contact-message",
  // validateRequest(OrganizationValidation.createOrganizationValidation),
  GuestMessageController.craeteGuestMessage
);

export const GuestMessageRoutes = router;
