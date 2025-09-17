"use strict";
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
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const multerUpload = (0, multer_1.default)({ storage });
router.post("/upload-bulk-background-varificaton-csv", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), multerUpload.single("backgroundVarificationCsv"), background_varification_controller_1.backgroundVarificationController.createBulkBackgroundVarification);
router.get("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), background_varification_controller_1.backgroundVarificationController.getBackgroundVarificationAll);
router.get("/dashboard-payslip", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), background_varification_controller_1.backgroundVarificationController.getThisMonthPayslipCount);
exports.BackgroundVarificationRoutes = router;
