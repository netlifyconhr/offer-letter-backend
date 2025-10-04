import { Router } from "express";
import multer from "multer";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { payslipController } from "./payslip.controller";
// import PaySlip from "./payslip.model";

const router = Router();

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-payslip-csv",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN),
  multerUpload.single("multiplePayslipCsv"),
  payslipController.createBulkOfferLetter
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN,UserRole.VERIFIER),

  payslipController.getOfferLetterAll
);

router.get(
  "/dashboard-payslip",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN,UserRole.VERIFIER),
  payslipController.getThisMonthPayslipCount
);

// router.get("/delete-payslip-letters/:email", async (req, res, next) => {
//   try {
//     const employeeEmail = req.params.email;

//     const result = await PaySlip.deleteMany({ employeeEmail });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: "No offer letters found." });
//     }

//     res.status(200).json({
//       message: `${result.deletedCount} offer letter(s) deleted for ${employeeEmail}`,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

export const PayslipLetterRoutes = router;
