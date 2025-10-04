import { Router } from "express";
import multer from "multer";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import { offerLetterController } from "./offer-letter.controller";
// import OfferLetter from "./offer-letter.model";

const router = Router();

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-offer-letter-csv",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN),
  multerUpload.single("multipleOfferLetterCsv"),

  offerLetterController.createBulkOfferLetter
);
router.get(
  "/dashboard-count",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN,UserRole.VERIFIER),

  offerLetterController.getOfferLetterAll
);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN,UserRole.VERIFIER),

  offerLetterController.getOfferLetterAll
);

router.post(
  "/offer-acknowledge/:employeeEmail",
  offerLetterController.acknowledgeById
);
// router.get("/delete-offer-letters/:email", async (req, res, next) => {
//   try {
//     const employeeEmail = req.params.email;

//     const result = await OfferLetter.deleteMany({ employeeEmail });

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

export const OfferLetterRoutes = router;
