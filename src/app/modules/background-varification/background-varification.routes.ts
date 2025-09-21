import { Router } from "express";
import multer from "multer";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { backgroundVarificationController } from "./background-varification.controller";
import multerUploadGlobal from "../../config/multer.config";
import BackgroundVarification from "./background-varification.model";
import { BackgroundVarificationType } from "./background-varification.interface";

const router = Router();

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-bulk-background-varificaton-csv",
  auth(UserRole.ADMIN, UserRole.USER),
  multerUpload.single("backgroundVarificationCsv"),
  backgroundVarificationController.createBulkBackgroundVarification
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
