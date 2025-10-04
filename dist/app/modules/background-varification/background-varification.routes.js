"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundVarificationRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const background_varification_controller_1 = require("./background-varification.controller");
const multer_config_1 = __importDefault(require("../../config/multer.config"));
const background_varification_model_1 = __importDefault(require("./background-varification.model"));
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const multerUpload = (0, multer_1.default)({ storage });
router.post("/upload-bulk-background-varificaton-csv", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER, user_interface_1.UserRole.SUPERADMIN), multerUpload.single("backgroundVarificationCsv"), background_varification_controller_1.backgroundVarificationController.createBulkBackgroundVarification);
router.patch("/update-details/:employeeId", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER, user_interface_1.UserRole.SUPERADMIN), background_varification_controller_1.backgroundVarificationController.updateBackgroundVarification);
router.post("/upload-required-documents/:id", multer_config_1.default.fields([
    { name: "pan", maxCount: 1 },
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "experience", maxCount: 1 },
    { name: "education", maxCount: 1 },
    { name: "photo", maxCount: 1 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    // Helper to extract Cloudinary URL (if file was uploaded)
    const getFileUrl = (field) => {
        var _a;
        const file = (_a = files === null || files === void 0 ? void 0 : files[field]) === null || _a === void 0 ? void 0 : _a[0];
        return file ? file.path : undefined; // Cloudinary URL
    };
    // Build payload directly matching schema fields
    const payload = {
        pan: getFileUrl("pan"),
        aadharFront: getFileUrl("aadharFront"),
        aadharBack: getFileUrl("aadharBack"),
        education: getFileUrl("education"),
        experience: getFileUrl("experience"),
        photo: getFileUrl("photo"),
    };
    try {
        const updated = yield background_varification_model_1.default.findByIdAndUpdate(req.params.id, payload, { new: true });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to upload documents.",
            error: "error?.message",
        });
    }
}));
router.get("/", 
// auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPERADMIN, UserRole.VERIFIER),
background_varification_controller_1.backgroundVarificationController.getBackgroundVarificationAll);
router.get("/dashboard-payslip", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER, user_interface_1.UserRole.SUPERADMIN), background_varification_controller_1.backgroundVarificationController.getThisMonthPayslipCount);
exports.BackgroundVarificationRoutes = router;
