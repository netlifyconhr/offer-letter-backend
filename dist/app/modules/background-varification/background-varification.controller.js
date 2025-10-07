"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.backgroundVarificationController = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const background_varification_service_1 = require("./background-varification.service");
// paySlip.schema.ts
const XLSX = __importStar(require("xlsx"));
const zod_1 = require("zod");
const backgroundVerificationSchema = zod_1.z.object({
    employeeName: zod_1.z.string().nonempty(),
    employeeId: zod_1.z.string().nonempty(),
    employeeDesignation: zod_1.z.string().nonempty(),
    employeeDepartment: zod_1.z.string().nonempty(),
    employeeEmail: zod_1.z.string().email(),
    companyName: zod_1.z.string().nonempty(),
    companyBranch: zod_1.z.string().nonempty(),
    companyRegion: zod_1.z.string().nonempty(),
    employeeGender: zod_1.z.string().nonempty(),
    pan: zod_1.z.string().optional(),
    aadharFront: zod_1.z.string().optional(),
    aadharBack: zod_1.z.string().optional(),
    experience: zod_1.z.string().optional(),
    education: zod_1.z.string().optional(),
    photo: zod_1.z.string().optional(),
    educationStatus: zod_1.z.string().optional(),
    experienceStatus: zod_1.z.string().optional(),
    addressStatus: zod_1.z.string().optional(),
    criminalStatus: zod_1.z.string().optional(),
    panStatus: zod_1.z.string().optional(),
    adharStatus: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
    employeePhone: zod_1.z.string().optional(),
    employeeDateOfJoin: zod_1.z.string().optional(), // consider z.coerce.date() if you want to parse it as Date
});
exports.backgroundVarificationController = {
    getBackgroundVarificationAll: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield background_varification_service_1.backgroundVarificationService.getOfferLetterAll(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "OfferLetter are retrieved successfully",
            meta: result.meta,
            data: result.result,
        });
    })),
    updateBackgroundVarification: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield background_varification_service_1.backgroundVarificationService.getAndUpdateEmployeeById(req.params.employeeId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Background varification are updated successfully",
            data: result,
        });
    })),
    getThisMonthPayslipCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield background_varification_service_1.backgroundVarificationService.getThisMonthPayslipCount();
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: "Offer Letter retrived succesfully",
                data: result,
            });
        });
    },
    createBulkBackgroundVarification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Empty or invalid Excel file");
            }
            const workbook = XLSX.read(file.buffer, {
                type: "buffer",
                cellDates: true,
            });
            const sheetName = workbook.SheetNames[0];
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                defval: "",
                raw: false,
            });
            // Validate and filter valid rows
            const validPaySlips = [];
            for (const row of rows) {
                const result = backgroundVerificationSchema.safeParse(row);
                if (result.success) {
                    validPaySlips.push(result.data);
                }
                else {
                    console.warn("Invalid row skipped:", result.error.flatten().fieldErrors);
                }
            }
            const result = yield background_varification_service_1.backgroundVarificationService.createBulkBackgroundVarificationData(validPaySlips);
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true,
                message: "Bulk employee data processed for background verification!",
                data: result,
            });
        });
    },
};
