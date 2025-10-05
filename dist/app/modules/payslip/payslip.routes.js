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
exports.PayslipLetterRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const payslip_controller_1 = require("./payslip.controller");
const payslip_model_1 = __importDefault(require("./payslip.model"));
// import PaySlip from "./payslip.model";
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const multerUpload = (0, multer_1.default)({ storage });
router.post("/upload-payslip-csv", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER, user_interface_1.UserRole.SUPERADMIN), multerUpload.single("multiplePayslipCsv"), payslip_controller_1.payslipController.createBulkOfferLetter);
router.get("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER, user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.VERIFIER), payslip_controller_1.payslipController.getOfferLetterAll);
router.get("/dashboard-payslip", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER, user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.VERIFIER), payslip_controller_1.payslipController.getThisMonthPayslipCount);
router.get("/delete-payslip-letters/:email", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeEmail = req.params.email;
        const result = yield payslip_model_1.default.deleteMany({ employeeEmail });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No offer letters found." });
        }
        res.status(200).json({
            message: `${result.deletedCount} offer letter(s) deleted for ${employeeEmail}`,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.PayslipLetterRoutes = router;
