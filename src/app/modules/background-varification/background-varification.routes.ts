import { Router } from "express";
import multer from "multer";
import multerUploadGlobal from "../../config/multer.config";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { backgroundVarificationController } from "./background-varification.controller";
import { BackgroundVarificationType } from "./background-varification.interface";
import BackgroundVarification from "./background-varification.model";

const router = Router();

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-bulk-background-varificaton-csv",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN),
  multerUpload.single("backgroundVarificationCsv"),
  backgroundVarificationController.createBulkBackgroundVarification
);

router.patch(
  "/update-details/:employeeId",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN),
  backgroundVarificationController.updateBackgroundVarification
);

router.post(
  "/upload-required-documents/:id",
  multerUploadGlobal.fields([
    { name: "pan", maxCount: 1 },
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "experience", maxCount: 1 },
    { name: "education", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Helper to extract Cloudinary URL (if file was uploaded)
    const getFileUrl = (field: keyof typeof files) => {
      const file = files?.[field]?.[0];
      return file ? file.path : undefined; // Cloudinary URL
    };

    // Build payload directly matching schema fields
    const payload: Partial<BackgroundVarificationType> = {
      pan: getFileUrl("pan"),
      aadharFront: getFileUrl("aadharFront"),
      aadharBack: getFileUrl("aadharBack"),
      education: getFileUrl("education"),
      experience: getFileUrl("experience"),
      photo: getFileUrl("photo"),
    };

    try {
      const updated = await BackgroundVarification.findByIdAndUpdate(
        req.params.id,
        payload,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Background verification record not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Documents uploaded successfully.",
        userId: req.params.id,
        documents: payload,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload documents.",
        error: "error?.message",
      });
    }
  }
);

router.delete(
  "/upload-required-documents/:id",
  async (req, res) => {
    const payload = req.body

    try {
      const updated = await BackgroundVarification.findByIdAndUpdate(
        req.params.id,
        payload,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Background verification record not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Message updated successfully.",
        userId: req.params.id,
        documents: updated,  // Returning updated document details (can include message, etc.)
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update message.",
        error: error || "Unknown error",
      });
    }
  }
);

router.get(
  "/",
  // auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN, UserRole.VERIFIER),

  backgroundVarificationController.getBackgroundVarificationAll
);

router.get(
  "/dashboard-payslip",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN),
  backgroundVarificationController.getThisMonthPayslipCount
);

// router.get("/complete-verification-status", async (req, res) => {
//   const employeeIds = [

//     "WRAB5168",
// "WRMS1306",
// "WRSR9838",
// "WRSJ2336",
// "WRAB6181",
// "WRAB7698",
//     "WRAG2751",
//     "WRAK4300",
//     "WRAK4319",
//     "WRAK7894",
//     "WRAP0022",
//     "WRAS0705",
//     "WRAS7061",
//     "WRAS9028",
//     "WRAT9410",
//     "WRDB9660",
//     "WRIK1569",
//     "WRJS4025",
//     "WRKC5885",
//     "WRKR5950",
//     "WRMB9287",
//     "WRMS2799",
//     "WRNK9036",
//     "WRNS7207",
//     "WRPM1181",
//     "WRPS3607",
//     "WRPS3946",
//     "WRSK2285",
//     "WRSK9792",
//     "WRSM1866",
//     "WRSR2555",
//     "WRSS9826",
//     "WRUC1397",
//     "WRVS5960",
//     "WRZF9835",
//     "WRPR8420",
//     "WRAA3541",
//     "WRAP3986",
//     "WRM2365",
//     "WRPD0040"
//   ];

//   try {
//     const result = await BackgroundVarification.updateMany(
//       { employeeId: { $in: employeeIds } },
//       { $set: { verificationStatus: "completed" } }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No background verification records found for provided employee IDs.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Verification statuses updated successfully.",
//       modifiedCount: result.modifiedCount,
//     });
//   } catch (error) {
//     console.error("Error updating verification statuses:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update verification statuses.",
//       error: error.message || "Unknown error",
//     });
//   }
// });

export const BackgroundVarificationRoutes = router;
