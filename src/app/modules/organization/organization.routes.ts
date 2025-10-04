import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middleware/auth";
import { parseBody } from "../../middleware/bodyParser";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.interface";
import { OrganizationController } from "./organization.controller";
import { OrganizationValidation } from "./organization.validation";

const router = Router();

router.get(
  "/my-organization",
  auth(UserRole.USER, UserRole.SUPERADMIN,UserRole.VERIFIER),
  OrganizationController.getMyOrganization
);

router.post(
  "/",
  auth(UserRole.SUPERADMIN),
  multerUpload.single("logo"),
  parseBody,
  validateRequest(OrganizationValidation.createOrganizationValidation),
  OrganizationController.createOrganization
);

export const OrganizationRoutes = router;
