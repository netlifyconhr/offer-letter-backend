import { Router } from "express";
import multer from "multer";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { backgroundVarificationController } from "./background-varification.controller";

const router = Router();

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-bulk-background-varificaton-csv",
  auth(UserRole.ADMIN, UserRole.USER),
  multerUpload.single("backgroundVarificationCsv"),
  backgroundVarificationController.createBulkBackgroundVarification
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),

  backgroundVarificationController.getBackgroundVarificationAll
);

router.get(
  "/dashboard-payslip",
  auth(UserRole.ADMIN, UserRole.USER),
  backgroundVarificationController.getThisMonthPayslipCount
);

export const BackgroundVarificationRoutes = router;
